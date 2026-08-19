/**
 * QRIS Generator Utility
 * Generates dynamic QRIS string with embedded exact amount & CRC16 checksum
 */

function crc16(data: string): string {
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

export function generateDynamicQris(baseQris: string, amount: number): string {
  if (!baseQris) {
    baseQris = '00020101021126570014ID.LINKAJA.WWW01189360091438201948215204581253033605802ID5920NEXA+CAPITAL+OFFICIAL6007JAKARTA61051234062070703A016304';
  }

  // Remove existing CRC (last 4 hex digits) and 6304 tag if present
  let clean = baseQris.trim();
  const crcIndex = clean.lastIndexOf('6304');
  if (crcIndex !== -1) {
    clean = clean.substring(0, crcIndex);
  }

  // Convert 010211 (static) to 010212 (dynamic)
  clean = clean.replace('010211', '010212');

  // Add Tag 54 (Transaction Amount)
  const amountStr = Math.round(amount).toString();
  const amountTag = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}5802ID`;

  // Check if tag 54 already exists
  const tag54Index = clean.indexOf('54');
  if (tag54Index !== -1) {
    // replace tag 54 up to 5802ID
    const tag58Index = clean.indexOf('5802ID');
    if (tag58Index !== -1) {
      clean = clean.substring(0, tag54Index) + clean.substring(tag58Index + 6);
    }
  }

  // Inject amount before Tag 58/59
  let finalBody = '';
  if (clean.includes('5802ID')) {
    finalBody = clean.replace('5802ID', amountTag);
  } else if (clean.includes('59')) {
    const tag59Index = clean.indexOf('59');
    finalBody = clean.substring(0, tag59Index) + amountTag + clean.substring(tag59Index);
  } else {
    finalBody = clean + amountTag;
  }

  // Append 6304 + CRC
  const toChecksum = finalBody + '6304';
  const checksum = crc16(toChecksum);
  return toChecksum + checksum;
}

export function getQrisQrImageUrl(qrisString: string): string {
  const encoded = encodeURIComponent(qrisString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encoded}&margin=10`;
}
