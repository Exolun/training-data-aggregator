export default class TrainingDatabase {
    constructor() {
        this.dbName = "TrainingDB";
        this.version = 1;
        this.contextStore = "contextData";
        this.settingsStore = "settings";
        this.defaultMemory = {
            user_role: "Knowledge Base Expert",
            topic: "Software Projects"
        };
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.contextStore)) {
                    db.createObjectStore(this.contextStore, { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains(this.settingsStore)) {
                    db.createObjectStore(this.settingsStore, { keyPath: "id" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getContextData() {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.contextStore, "readonly");
            const store = tx.objectStore(this.contextStore);
            const request = store.get("context");
            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.data);
                } else {
                    resolve({
                        context: {
                            memory: { ...this.defaultMemory },
                            files: []
                        }
                    });
                }
            };
        });
    }

    async saveOrUpdatePage(url, pageContent, pageTitle, source = "web_article") {
        const db = await this.openDatabase();
        const contextData = await this.getContextData();

        const fileEntry = {
            name: pageTitle || url,
            metadata: {
                source: url,
                type: source
            },
            content: pageContent
        };

        contextData.context.files = contextData.context.files.filter(
            f => f.metadata.source !== url
        );
        contextData.context.files.push(fileEntry);

        return new Promise((resolve) => {
            const tx = db.transaction(this.contextStore, "readwrite");
            const store = tx.objectStore(this.contextStore);
            store.put({
                id: "context",
                data: contextData
            });
            tx.oncomplete = () => resolve(true);
        });
    }

    async getDataset() {
        return this.getContextData();
    }

    async clearDataset() {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.contextStore, "readwrite");
            tx.objectStore(this.contextStore).delete("context");
            tx.oncomplete = () => resolve(true);
        });
    }

    async updateDataset(newContextData) {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.contextStore, "readwrite");
            const store = tx.objectStore(this.contextStore);
            store.put({
                id: "context",
                data: newContextData
            });
            tx.oncomplete = () => resolve(true);
        });
    }

    async getFileName() {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.settingsStore, "readonly");
            const store = tx.objectStore(this.settingsStore);
            const request = store.get("fileName");
            request.onsuccess = () => resolve(request.result ? request.result.value : "trainingData.json");
        });
    }

    async updateFileName(newFileName) {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.settingsStore, "readwrite");
            const store = tx.objectStore(this.settingsStore);
            store.put({ id: "fileName", value: newFileName });
            tx.oncomplete = () => resolve(true);
        });
    }
}