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

export const OFFICIAL_AUTHENTIC_QRIS_STATIC = '00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL CELL, BNDNG KD6007BANDUNG61054011562070703A0163047906';

export function generateDynamicQris(baseQris: string, amount?: number): string {
  const cleanBase = (baseQris && baseQris.trim().length > 30) ? baseQris.trim() : OFFICIAL_AUTHENTIC_QRIS_STATIC;
  if (!amount || amount <= 0) {
    return cleanBase;
  }

  // Convert static '010211' to dynamic '010212'
  let payload = cleanBase.replace('010211', '010212');

  // Strip existing CRC tag '6304...' if present
  const tag63Idx = payload.lastIndexOf('6304');
  if (tag63Idx !== -1) {
    payload = payload.substring(0, tag63Idx);
  }

  // Remove old tag 54 if present
  payload = payload.replace(/54\d{2}\d+/, '');

  // Format Tag 54 (Transaction Amount)
  const amtStr = String(Math.round(amount));
  const tag54 = `54${String(amtStr.length).padStart(2, '0')}${amtStr}`;

  // Insert tag 54 right after currency tag 5303360
  if (payload.includes('5303360')) {
    payload = payload.replace('5303360', `5303360${tag54}`);
  } else {
    // If not found, insert before country code 5802ID
    if (payload.includes('5802ID')) {
      payload = payload.replace('5802ID', `${tag54}5802ID`);
    } else {
      payload += tag54;
    }
  }

  // Calculate new CRC16
  const toChecksum = `${payload}6304`;
  const checksum = crc16(toChecksum);
  return `${toChecksum}${checksum}`;
}

export function getStaticQris(baseQris?: string): string {
  const cleanBase = (baseQris && baseQris.trim().length > 30) ? baseQris.trim() : OFFICIAL_AUTHENTIC_QRIS_STATIC;
  // Ensure it has static tag 010211
  let payload = cleanBase.replace('010212', '010211');
  // Remove tag 54 if present
  payload = payload.replace(/54\d{2}\d+/, '');
  const tag63Idx = payload.lastIndexOf('6304');
  if (tag63Idx !== -1) {
    payload = payload.substring(0, tag63Idx);
  }
  const toChecksum = `${payload}6304`;
  const checksum = crc16(toChecksum);
  return `${toChecksum}${checksum}`;
}

export function getQrisQrImageUrl(qrisString: string): string {
  const encoded = encodeURIComponent(qrisString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encoded}&margin=8`;
}

