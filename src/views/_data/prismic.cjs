require("dotenv").config();

const PRISMIC_REPO = process.env.PRISMIC_REPO;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const prismic = require("@prismicio/client");
const prismicH = require("@prismicio/helpers");
const axios = require("axios");

const axiosAdapter = async (url, options = {}) => {
  try {
    const response = await axios({ url, ...options });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: () => Promise.resolve(response.data),
    };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: () => Promise.resolve(error.response.data),
      };
    }
    throw error;
  }
};

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
  fetch: axiosAdapter,
});

async function fetchAbout() {
  return client.getSingle("about");
}

async function fetchPreloader() {
  return client.getSingle("preloader");
}

async function fetchHome() {
  return client.getSingle("home");
}

async function fetchMeta() {
  return client.getSingle("meta");
}

async function fetchCollections() {
  return client.getAllByType("collection", {
    fetchLinks: ["product.name", "product.image"],
  });
}

async function fetchProducts() {
  return client.getAllByType("product", {
    fetchLinks: "collection.title",
  });
}

async function fetchPrismicData() {
  const [
    about,
    preloader,
    home,
    collections,
    products,
    // meta
  ] = await Promise.all([
    fetchAbout(),
    fetchPreloader(),
    fetchHome(),
    fetchCollections(),
    fetchProducts(),
    // fetchMeta(),
  ]);

  const data = {
    about,
    preloader,
    home,
    collections,
    products,
    // meta,
    ...prismicH,
  };

  return data;
}

module.exports = fetchPrismicData;
