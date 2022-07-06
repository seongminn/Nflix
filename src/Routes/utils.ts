export function makeImgPath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

// https://image.tmdb.org/t/p/w500/507086/3PieOs1t6dPHWlgvX3XoqTIQLqN.jpg
