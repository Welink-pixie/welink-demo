export const AUTH_COOKIE_NAME = "welink_session";
export const AUTH_USERNAME_COOKIE_NAME = "welink_username";
export const AUTH_SUBSCRIPTION_COOKIE_NAME = "welink_subscription";

export const AUTH_USERNAME = process.env.WELINK_AUTH_USERNAME ?? "Ted";
export const AUTH_PASSWORD = process.env.WELINK_AUTH_PASSWORD ?? "sellmethispen";
export const AUTH_DEFAULT_SUBSCRIBED = process.env.WELINK_DEFAULT_SUBSCRIBED === "true";
