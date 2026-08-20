export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatEyebrowDate(dateString: string): string {
  if (!dateString) return 'CELEBRATING LIFE';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString.toUpperCase();
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();
    
    // Add ordinal suffix (1ST, 2ND, 3RD, 4TH)
    const suffix = ['TH', 'ST', 'ND', 'RD'];
    const v = day % 100;
    const ord = suffix[(v - 20) % 10] || suffix[v] || suffix[0];
    
    return `${month} ${day}${ord} ${year}`;
  } catch {
    return dateString.toUpperCase();
  }
}

export function formatAudioUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If it's a Base64 data URL, return directly
  if (trimmed.startsWith('data:audio/')) {
    return trimmed;
  }

  // Convert Google Drive links to Google CDN Direct Audio Stream URL (lh3.googleusercontent.com/d/FILE_ID)
  const gdriveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1] && (trimmed.includes('google.com') || trimmed.includes('drive.google'))) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
  }

  return trimmed;
}

export function cryptoNativeOrFallback(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
