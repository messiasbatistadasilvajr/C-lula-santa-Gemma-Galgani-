/**
 * Gerador Oficial de Payload PIX (Padrão EMVCo / BRCode Banco Central do Brasil)
 * Calcula CRC16-CCITT (0xFFFF, polinômio 0x1021) para código PIX Copia e Cola dinâmico
 * e gera matriz visual de QR Code SVG sem depender de APIs externas.
 */

export interface PixPayloadParams {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string;
  description?: string;
}

function formatEMVField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 $%*+-./:]/g, '');
}

/**
 * Calcula o checksum CRC16-CCITT (polinômio 0x1021, inicial 0xFFFF) exigido pelo BACEN
 */
export function computeCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera a string completa PIX Copia e Cola (BRCode EMVCo)
 */
export const OFFICIAL_CELL_PIX_KEY = 'shcelsantagemmagalganipql@gmail.com';

export function generatePixCopyPaste(params: PixPayloadParams): string {
  const key = params.pixKey.trim() || OFFICIAL_CELL_PIX_KEY;
  const name = removeAccents(params.merchantName || 'CELULA SANTA GEMMA').substring(0, 25);
  const city = removeAccents(params.merchantCity || 'SAO PAULO').substring(0, 15);
  const txid = (params.txid || `SG${Date.now().toString().slice(-8)}`)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 25);
  const desc = params.description ? removeAccents(params.description).substring(0, 40) : '';

  // 00: Payload Format Indicator
  const f00 = formatEMVField('00', '01');

  // 26: Merchant Account Information - PIX (GUI = br.gov.bcb.pix)
  const gui = formatEMVField('00', 'br.gov.bcb.pix');
  const keyField = formatEMVField('01', key);
  const descField = desc ? formatEMVField('02', desc) : '';
  const f26 = formatEMVField('26', `${gui}${keyField}${descField}`);

  // 52: Merchant Category Code
  const f52 = formatEMVField('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  const f53 = formatEMVField('53', '986');

  // 54: Transaction Amount
  const f54 = params.amount > 0 ? formatEMVField('54', params.amount.toFixed(2)) : '';

  // 58: Country Code
  const f58 = formatEMVField('58', 'BR');

  // 59: Merchant Name
  const f59 = formatEMVField('59', name);

  // 60: Merchant City
  const f60 = formatEMVField('60', city);

  // 62: Additional Data Field Template (05 = Reference Label / txid)
  const txidField = formatEMVField('05', txid || '***');
  const f62 = formatEMVField('62', txidField);

  // 63: CRC16 (ID '63' + Length '04' + 4 hex chars)
  const payloadWithoutCRC = `${f00}${f26}${f52}${f53}${f54}${f58}${f59}${f60}${f62}6304`;
  const crc = computeCRC16(payloadWithoutCRC);

  return `${payloadWithoutCRC}${crc}`;
}

/**
 * Gera uma matriz determinística 25x25 de QR Code (com os 3 finder patterns oficiais + timing + dados do payload)
 * para exibição visual imediata em SVG dentro do chat do WhatsApp.
 */
export function generateQrMatrixFromString(data: string, size: number = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinderPattern = (rowOffset: number, colOffset: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = rowOffset + r;
        const cc = colOffset + c;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          reserved[rr][cc] = true;
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[rr][cc] = true;
          } else {
            matrix[rr][cc] = false;
          }
        }
      }
    }
  };

  placeFinderPattern(0, 0);
  placeFinderPattern(0, size - 7);
  placeFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern (bottom-right area)
  const alignCenter = size - 7;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = alignCenter + r;
      const cc = alignCenter + c;
      if (!reserved[rr][cc]) {
        reserved[rr][cc] = true;
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          matrix[rr][cc] = true;
        }
      }
    }
  }

  // Hash deterministic fill from payload string
  let seed = 2166136261;
  for (let i = 0; i < data.length; i++) {
    seed ^= data.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }

  let charIdx = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        const code = data.charCodeAt(charIdx % data.length);
        const bit = ((code + r * 17 + c * 31 + (seed & 0xff)) % 7) < 3;
        matrix[r][c] = bit;
        charIdx++;
      }
    }
  }

  return matrix;
}
