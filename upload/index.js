const { google } = require("googleapis");
const fs = require("fs");
const credentials = require("../config/constants/google");

const TAG = "GOOGLE_API";
const log = (mess) => {
  console.log(`[${TAG}]: ${mess}`);
};
const logFail = (mess) => {
  console.log(`[${TAG}_FAIL]: ${mess}`);
};

class GGAPI {
  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      credentials.CLIENT_ID,
      credentials.CLIENT_SECRET,
      credentials.REDIRECT_URLS[0]
    );

    this.oAuth2Client.setCredentials({
      refresh_token: credentials.REFRESH_TOKEN,
    });
    this.drive = google.drive({ version: "v3", auth: this.oAuth2Client });
  }

  getRefreshToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: credentials.SCOPES,
    });

    log(`Authorize this app by visiting this url: ${authUrl}`);
  }

  getFileIDFromURL(url) {
    if (!url) return null;

    let fileId = "";
    const NULL_STRING = "_^^__/**_NULL_STRING_**/__^^_";

    const _TEMPLATE = [
      {
        head: "https://drive.google.com/uc?id=",
        tail: "&export=download",
      },
      {
        head: "https://drive.google.com/file/d/",
        tail: "/view?usp=",
      },
      {
        head: "https://drive.google.com/open?id=",
        tail: NULL_STRING,
      },
    ];

    _TEMPLATE.forEach((template) => {
      if (url.includes(template.head)) {
        fileId = url.split(template.head)[1];
      }

      if (url.includes(template.tail)) {
        fileId = fileId.split(template.tail)[0];
      }
    });

    return !!fileId ? fileId : null;
  }

  async generatePublicUrl(fileId) {
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await this.drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
      });

      log(`generate public url success.`);

      return result.data;
    } catch (error) {
      logFail(`generate public url fail, ${error.message}`);
      return { webContentLink: null, webViewLink: null };
    }
  }

  async uploadFile(file) {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.name, //This can be name of your choice
          mimeType: file.type,
        },
        media: {
          mimeType: file.type,
          body: fs.createReadStream(file.path),
        },
      });

      const link = await this.generatePublicUrl(response.data.id);
      log(`upload file success, ${link}`);

      return link;
    } catch (error) {
      logFail(`upload file fail, ${error.message}`);

      const TOKEN_EXPIRED = "invalid_grant";
      if (error.message === TOKEN_EXPIRED) {
        logFail("Invalid token, please try get new REFRESH TOKEN");
        this.getAccessToken();
      }

      return { webContentLink: null, webViewLink: null };
    }
  }

  async deleteFile(url) {
    const fileId = this.getFileIDFromURL(url);
    if (!fileId) return false;

    try {
      const response = await this.drive.files.delete({ fileId });
      log(`delete file success with id ${fileId}, status ${response.status}`);
      return true;
    } catch (error) {
      logFail(`delete file fail, ${error.message}`);
      return false;
    }
  }

  async test() {
    console.log("GG_API_TEST_MODE");
    // const file = await this.uploadFile({
    //   name: "pao chat",
    //   type: "image/png",
    //   path: `${__dirname}/paochat.png`,
    // });

    // console.log(file);
  }
}

const uploadProvider = new GGAPI();

module.exports = uploadProvider;
