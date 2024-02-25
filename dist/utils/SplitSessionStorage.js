// Implement the interface in the SplitSessionStorage class
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
    // Private method to set an item in localStorage
    setItem(name, data) {
        return localStorage.setItem(name, JSON.stringify(data));
    }
    // Private method to get an item from localStorage
    getItem(name) {
        const data = localStorage.getItem(name);
        return JSON.parse(data);
    }
    // Private method to remove an item from localStorage
    removeItem(name) {
        return localStorage.removeItem(name);
    }
    /**
     * Public method from the interface to set session data.
     * @param size - Array of numbers representing session data.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @param closeSection - Is section is closed or not. either "true" or "false".
     */
    SetSession(size, splitMode, closeSection = false) {
        function set(key, sectionSize) {
            // Check if session is not available for the current URL
            if (!this.getItem(btoa(this.splitterLocalIdentifierPrefix + key))) {
                // Encode URL and set session data
                this.setItem(btoa(this.splitterLocalIdentifierPrefix + key), sectionSize);
            }
            else {
                // If session data exists, update it
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
    /**
     * Public method from the interface to get session data.
     * @param splitMode - Split mode, either "horizontal" or "vertical".
     * @@param closeSection - Is section is closed or not. either "true" or "false".
     * @returns An array of numbers representing session data.
     */
    GetSession(splitMode, closeSection = false) {
        function get(key, splitMode, prefix = "") {
            const finalKey = this.splitterLocalIdentifierPrefix + key + splitMode + prefix;
            const sessionData = this.getItem(btoa(finalKey));
            // Check if the stored URL matches the current URL and sessionData is available
            if (atob(btoa(finalKey)) ===
                this.splitterLocalIdentifierPrefix +
                    window.location.href +
                    splitMode +
                    prefix &&
                sessionData) {
                return sessionData;
            }
            // Return an empty array if no valid session data is found
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
// Export the SplitSessionStorage class
export default SplitSessionStorage;
