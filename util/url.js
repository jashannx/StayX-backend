const getServerBaseUrl = (req) => {
  const configuredBaseUrl =
    process.env.PUBLIC_BASE_URL ||
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  return `${req.protocol}://${req.get("host")}`;
};

const normalizeImageUrl = (image, req) => {
  if (!image) {
    return image;
  }

  const serverBaseUrl = getServerBaseUrl(req);

  if (image.startsWith("/uploads/")) {
    return `${serverBaseUrl}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${serverBaseUrl}/${image}`;
  }

  if (!/^https?:\/\//i.test(image)) {
    return `${serverBaseUrl}/uploads/${image}`;
  }

  try {
    const imageUrl = new URL(image);
    const isLocalImage =
      ["localhost", "127.0.0.1"].includes(imageUrl.hostname) &&
      imageUrl.pathname.startsWith("/uploads/");

    if (isLocalImage) {
      return `${serverBaseUrl}${imageUrl.pathname}`;
    }
  } catch {
    return image;
  }

  return image;
};

const serializeListing = (listing, req) => {
  const plainListing =
    typeof listing?.toObject === "function" ? listing.toObject() : { ...listing };

  return {
    ...plainListing,
    image: normalizeImageUrl(plainListing.image, req),
  };
};

export { getServerBaseUrl, normalizeImageUrl, serializeListing };
