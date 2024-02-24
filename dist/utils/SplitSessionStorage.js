class SplitSessionStorage {
    constructor() {
        this.splitterLocalIdentifierPrefix = "alphaFact";
        this.openPrefix = "open";
        this.closePrefix = "close";
        this.horizontalPrefix = "horizontal";
        this.verticalPrefix = "vertical";
        this.encodeBase64 = (data) => {
            return Buffer.from(data).toString("base64");
        };
        this.decodeBase64 = (data) => {
            return Buffer.from(data, "base64").toString("ascii");
        };
    }
    setItem(name, data) {
        return localStorage.setItem(name, JSON.stringify(data));
    }
    getItem(name) {
        const data = localStorage.getItem(name);
        return JSON.parse(data);
    }
    removeItem(name) {
        return localStorage.removeItem(name);
    }
    SetSession(size, splitMode, closeSection = false) {
        function set(key, sectionSize) {
            if (!this.getItem(btoa(this.splitterLocalIdentifierPrefix + key))) {
                this.setItem(btoa(this.splitterLocalIdentifierPrefix + key), sectionSize);
            }
            else {
                this.setItem(btoa(this.splitterLocalIdentifierPrefix + key), sectionSize);
            }
        }
        const _set = set.bind(this);
        if (closeSection) {
            _set(window.location.href + splitMode + this.closePrefix, size);
        }
        else {
            _set(window.location.href + splitMode, size);
        }
    }
    GetSession(splitMode, closeSection = false) {
        function get(key, splitMode, prefix = "") {
            const finalKey = this.splitterLocalIdentifierPrefix + key + splitMode + prefix;
            const sessionData = this.getItem(btoa(finalKey));
            if (atob(btoa(finalKey)) ===
                this.splitterLocalIdentifierPrefix +
                    window.location.href +
                    splitMode +
                    prefix &&
                sessionData) {
                return sessionData;
            }
            return [];
        }
        const _get = get.bind(this);
        if (closeSection) {
            const layout = _get(window.location.href, splitMode, this.closePrefix);
            this.removeItem(btoa(this.splitterLocalIdentifierPrefix +
                window.location.href +
                splitMode +
                this.closePrefix));
            return layout;
        }
        else {
            return _get(window.location.href, splitMode);
        }
    }
}
export default SplitSessionStorage;
