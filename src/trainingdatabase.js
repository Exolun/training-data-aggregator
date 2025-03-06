export default class TrainingDatabase {
    constructor() {
        this.dbName = "TrainingDB";
        this.version = 1;
        this.trainingStore = "trainingData";
        this.settingsStore = "settings";
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.trainingStore)) {
                    db.createObjectStore(this.trainingStore, { keyPath: "url" });
                }
                if (!db.objectStoreNames.contains(this.settingsStore)) {
                    db.createObjectStore(this.settingsStore, { keyPath: "id" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveOrUpdatePage(url, pageContent, pageTitle, source = "page") {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.trainingStore, "readwrite");
            const store = tx.objectStore(this.trainingStore);
            store.put({
                url,
                page_content: pageContent,
                page_title: pageTitle,
                source,
                timestamp: new Date().toISOString()
            });
            tx.oncomplete = () => resolve(true);
        });
    }

    async getDataset() {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.trainingStore, "readonly");
            const store = tx.objectStore(this.trainingStore);
            const data = {};
            store.openCursor().onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    data[cursor.key] = cursor.value;
                    cursor.continue();
                } else {
                    resolve(data);
                }
            };
        });
    }

    async clearDataset() {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.trainingStore, "readwrite");
            tx.objectStore(this.trainingStore).clear();
            tx.oncomplete = () => resolve(true);
        });
    }

    async updateDataset(newDataset) {
        const db = await this.openDatabase();
        return new Promise((resolve) => {
            const tx = db.transaction(this.trainingStore, "readwrite");
            const store = tx.objectStore(this.trainingStore);
            store.clear();
            for (const url in newDataset) {
                store.put({
                    url,
                    ...newDataset[url]
                });
            }
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