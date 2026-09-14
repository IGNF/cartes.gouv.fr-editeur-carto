class MissingFileError extends Error {
    constructor() {
        super();
        this.name = "MissingFileError";
    }
}
class UnsupportedExtensionError extends Error {
    constructor(extension: any) {
        super(extension);
        this.name = "UnsupportedExtensionError";
    }
}

class EmptyLayerError extends Error {
    constructor(fileName: any) {
        super(fileName);
        this.name = "EmptyLayerError";
    }
}

class MissingFileInZipError extends Error {
    constructor(fileName: any) {
        super(fileName);
        this.name = "MissingFileInZipError";
    }
}

class FileCorruptionError extends Error {
    constructor(reason: any) {
        super(reason);
        this.name = "FileCorruptionError";
    }
}

export { MissingFileError };
export { UnsupportedExtensionError };
export { EmptyLayerError };
export { MissingFileInZipError };
export { FileCorruptionError };
