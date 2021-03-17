declare namespace AsConstants {
  interface IConsts {
    LOCAL_STORAGE_PREFIX: string
    ASSETS_PREFIX: IASSETS_PREFIX
    ENV: IENV
  }

  interface IENV {
    SERVER_WEBAPI: string
    MEDIA_URL: string
    JSA_API_DOMAIN: string
  }

  interface IASSETS_PREFIX {
    image: string
    sound: string
    video: string
    document: string
    imageList: string
  }
}
