export enum GenerateType {
	SHUFFLE = "SHUFFLE"
}

export interface GenerateWallpaperRequest {
	width: number;
	height: number;
	tiling: number;
	gap: number;
	generateType: GenerateType;
}
