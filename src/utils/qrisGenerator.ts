/**
 * QRIS Generator Utility
 * Generates dynamic QRIS string with embedded exact amount & CRC16 checksum according to Bank Indonesia (ASPI / EMVCo) standard
 */

export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xffff).toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

export function parseTLVMap(data: string): Map<string, string> {
  const map = new Map<string, string>();
  let idx = 0;
  // strip 6304 if at end
  const tag63Idx = data.lastIndexOf('6304');
  const payload = (tag63Idx !== -1) ? data.substring(0, tag63Idx) : data;
  
  while (idx < payload.length) {
    const tag = payload.substring(idx, idx + 2);
    const lenStr = payload.substring(idx + 2, idx + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || idx + 4 + len > payload.length) {
      break;
    }
    const val = payload.substring(idx + 4, idx + 4 + len);
    map.set(tag, val);
    idx += 4 + len;
  }
  return map;
}

export function generateDynamicQris(baseQris: string, amount?: number): string {
  const defaultBase = '00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL CELL, BNDNG KD6007BANDUNG61054011562070703A0163047906';
  const cleanBase = (baseQris && baseQris.trim().length > 30) ? baseQris.trim() : defaultBase;
  
  const map = parseTLVMap(cleanBase);
  
  // Set Tag 01 to 12 (Dynamic QR) if amount is provided and > 0
  if (amount && amount > 0) {
    map.set('01', '12');
    map.set('54', Math.round(amount).toString());
  } else {
    map.delete('54');
    map.set('01', '11'); // Static
  }

  // Ensure Tag 53 is 360 (IDR) and Tag 58 is ID
  if (!map.has('53')) map.set('53', '360');
  if (!map.has('58')) map.set('58', 'ID');
  
  // Standard EMVCo / ASPI tag sequence
  const standardOrder = [
    '00', '01', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62'
  ];
  
  let body = '';
  for (const tag of standardOrder) {
    if (map.has(tag)) {
      const val = map.get(tag)!;
      const len = String(val.length).padStart(2, '0');
      body += `${tag}${len}${val}`;
    }
  }

  // Append any extra unhandled tags
  map.forEach((val, tag) => {
    if (!standardOrder.includes(tag) && tag !== '63') {
      const len = String(val.length).padStart(2, '0');
      body += `${tag}${len}${val}`;
    }
  });
  
  const toChecksum = body + '6304';
  const checksum = crc16(toChecksum);
  return toChecksum + checksum;
}

export function getQrisQrImageUrl(qrisString: string): string {
  const encoded = encodeURIComponent(qrisString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encoded}&margin=8`;
}

