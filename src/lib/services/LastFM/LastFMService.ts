import { config } from "@/config";
import { stringify } from "querystring";
import crypto from "crypto";
import { ScrobbleParams, UpdateNowPlayingParams } from "./LastFMService.types";

interface Params {
  [key: string]: any;
}

export class LastFMService {
  url = "https://ws.audioscrobbler.com/2.0/";

  get apikey(): string {
    return config.lastFM.apiKey;
  }

  get defaultParams(): Params {
    return {
      format: "json",
      api_key: this.apikey,
    };
  }

  buildParams(params: Params): string {
    return stringify({
      ...this.defaultParams,
      ...params,
    });
  }

  async request<T>(
    method: string,
    params: Params,
    fetchOptions?: RequestInit
  ): Promise<T> {
    const qparams = (params as any).api_key
      ? stringify({ ...params })
      : this.buildParams({ method, ...params });

    const response = await fetch(this.url + "?" + qparams, fetchOptions);

    const jsonResponse = await response.json();

    return jsonResponse as T;
  }

  async scrobbleTrack(params: ScrobbleParams, sk?: string) {
    return await this.authRequest(
      "track.scrobble",
      {
        ...params,
        sk: sk || config.lastFM.sessionKey,
      },
      { post: true }
    );
  }

  async updateNowPlaying(params: UpdateNowPlayingParams) {
    return await this.authRequest(
      "track.updateNowPlaying",
      {
        ...params,
        sk: config.lastFM.sessionKey,
      },
      { post: true }
    );
  }

  private async authRequest<T>(
    method: string,
    params: Params,
    options: { post?: boolean } = { post: false }
  ): Promise<T> {
    const builtParams = { ...this.defaultParams, ...params, method };
    const signature = Object.keys(builtParams)
      .filter((k) => k !== "format")
      .sort()
      .map((k) => `${k}${(builtParams as any)[k]}`)
      .join("");

    const api_sig = crypto
      .createHash("md5")
      .update(`${signature}${config.lastFM.sharedSecret}`, "utf8")
      .digest("hex");

    return await this.request<T>(
      method,
      { ...builtParams, api_sig },
      {
        method: options.post ? "POST" : "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  }
}
