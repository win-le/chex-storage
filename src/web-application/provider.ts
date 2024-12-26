export type ChexStorageConfig = {
  debug?: boolean;
};

class ChexStorageProvider {
  extensionId: string;
  config: ChexStorageConfig = {
    debug: false,
  };

  constructor(extensionId: string, config?: ChexStorageConfig) {
    this.extensionId = extensionId;

    this.config = { ...this.config, ...(config || {}) };
  }

  log(...args: any[]) {
    if (this.config.debug) {
      console.log(...args);
    }
  }

  async sendMessage(type: string, payload?: any) {
    this.log("[ChexDatabaseWeb]: Payload", { type, payload });

    return await new Promise((resolve, reject) => {
      if (!this.extensionId) {
        return;
      }

      try {
        chrome.runtime.sendMessage(
          this.extensionId,
          JSON.stringify({
            type,
            payload,
            config: this.config,
          }),
          (res) => {
            this.log("[ChexDatabaseWeb]: Data", res.data);
            resolve(res.data);
          }
        );
      } catch (error) {
        console.error("[ChexDatabaseWeb]: Error", error);
        reject(error);
      }
    });
  }
}

export default ChexStorageProvider;
