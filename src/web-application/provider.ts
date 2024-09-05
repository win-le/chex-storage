class ChexStorageProvider {
  extensionId: string;

  constructor(extensionId: string) {
    this.extensionId = extensionId;
  }

  async sendMessage(type: string, payload?: any) {
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
          }),
          (res) => {
            resolve(res.data);
          }
        );
      } catch (error) {
        // console.log("[ChexDatabaseWeb]: Error", error);
        reject(error);
      }
    });
  }
}

export default ChexStorageProvider;
