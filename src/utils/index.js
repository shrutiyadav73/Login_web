import ApiUrls from "src/routes/api";
import RestApiClient from "./RestApiClient";
import { fCurrency } from "./formatNumber";

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export function convertDateTimeFormat(dateString) {
  try {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Extract day, month, and year from the formatted date
    const [month, day, year] = formattedDate.split("/");

    // Rearrange the date components to the desired format
    const convertedDate = `${day}/${month}/${year}`;

    return convertedDate;
  } catch (err) {
    return null;
  }
}

export function formateDate(dateString, configuration) {
  configuration = {
    withTime: true,
    blankOutput: "-",
    ...configuration,
  };

  const date = new Date(dateString);

  let output = "";

  output = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  if (configuration.withTime) {
    output +=
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
  }

  return output.indexOf("Invalid") !== -1 ? configuration.blankOutput : output;
}

export function compareDatesWithSameTimezone(date1, date2) {
  // Get the timezone offsets of both dates
  const offset1 = date1.getTimezoneOffset();
  const offset2 = date2.getTimezoneOffset();

  // Adjust dates to have the same timezone
  const adjustedDate1 = new Date(date1.getTime() + offset1 * 60000); // Convert offset to milliseconds
  const adjustedDate2 = new Date(date2.getTime() + offset2 * 60000);

  // Compare the adjusted dates
  if (adjustedDate1.getTime() === adjustedDate2.getTime()) {
    return 0; // Dates are equal
  } else if (adjustedDate1.getTime() < adjustedDate2.getTime()) {
    return -1; // Date1 is before Date2
  } else {
    return 1; // Date1 is after Date2
  }
}

export default function addSpaceBetweenWords(word1, word2) {
  return word1 + " " + word2;
}

export function convertHtmlToText(html) {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(html, "text/html");
  return parsedHtml.body.textContent;
}

export function customSlice(arr, start, end) {
  const length = arr == null ? 0 : arr.length;

  if (!length) {
    return [];
  }

  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  // Handle negative indices
  if (start < 0) {
    start = Math.max(length + start, 0);
  }

  if (end < 0) {
    end = Math.max(length + end, 0);
  }

  const slicedArray = [];

  for (let i = start; i < end && i < length; i++) {
    slicedArray.push(arr[i]);
  }

  return slicedArray;
}

export function formateCurrency(number) {
  return fCurrency(number).replace("$", "₹ ") === ""
    ? "₹ 0"
    : fCurrency(number).replace("$", "₹ ");
}

export function isLoggedIn() {
  return localStorage.getItem("token") ? true : false;
}

export const Api = new RestApiClient();

export function convertToSlug(str) {
  // Replace spaces and special characters with dashes
  const slug = str
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .toLowerCase(); // Convert to lowercase

  return slug;
}

export function extractIdFromSlug(slug) {
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

// export function base64ToBlob(base64String) {
//   // Split the base64 string into data and metadata
//   const [data, metadata] = base64String.split(",");

//   // Extract the MIME type from the metadata or automatically detect it
//   let mimeType;
//   if (metadata && metadata.match(/data:([^;]+)/)) {
//     mimeType = metadata.match(/data:([^;]+)/)[1];
//   } else {
//     const base64Prefix = "data:";
//     const dataStartIndex =
//       base64String.indexOf(base64Prefix) + base64Prefix.length;
//     const dataEndIndex = base64String.indexOf(";", dataStartIndex);
//     mimeType = base64String.substring(dataStartIndex, dataEndIndex);
//   }

//   // Decode the base64 data
//   const decodedData = atob(data);

//   // Create an array buffer from the decoded data
//   const buffer = new ArrayBuffer(decodedData.length);
//   const view = new Uint8Array(buffer);
//   for (let i = 0; i < decodedData.length; i++) {
//     view[i] = decodedData.charCodeAt(i);
//   }

//   // Create the Blob object
//   const blob = new Blob([view], { type: mimeType });

//   return blob;
// }

export function base64ToBlob(base64String) {
  console.log("Base64String", base64String);

  // Split the base64 string into data and metadata
  const [metadata] = base64String.split(",");

  // Extract the MIME type from the metadata or automatically detect it
  let mimeType;
  if (metadata && metadata.match(/data:([^;]+)/)) {
    mimeType = metadata.match(/data:([^;]+)/)[1];
  } else {
    const base64Prefix = "data:";
    const dataStartIndex =
      base64String.indexOf(base64Prefix) + base64Prefix.length;
    const dataEndIndex = base64String.indexOf(";", dataStartIndex);
    mimeType = base64String.substring(dataStartIndex, dataEndIndex);
  }

  // Validate and decode the base64 data
  let decodedData;
  try {
    decodedData = atob(base64String);
  } catch (error) {
    console.error("Invalid Base64 string:", error);
    return null;
  }

  // Create an array buffer from the decoded data
  const buffer = new ArrayBuffer(decodedData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < decodedData.length; i++) {
    view[i] = decodedData.charCodeAt(i);
  }

  // Create the Blob object
  const blob = new Blob([view], { type: mimeType });

  return blob;
}

export function downloadFile(file) {
  let a = document.createElement("a"); //Create <a>
  a.href = file.preview ?? ""; //Image Base64 Goes here
  a.target = "_blank";
  a.download = file.name ?? file.preview; //File name Here
  a.click(); //Downloaded file
}

export function mergeObjectsRecursive(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        if (!target.hasOwnProperty(key) || typeof targetValue !== "object") {
          target[key] = {};
        }
        mergeObjectsRecursive(target[key], sourceValue);
      } else if (Array.isArray(sourceValue)) {
        target[key] = (targetValue || []).concat(sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }

  return target;
}

export function downloadFileFromURL(url) {
  // Fetch the file from the URL
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary URL for the blob
      const blobURL = URL.createObjectURL(blob);

      // Create a hidden anchor element to initiate the download
      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = url.substring(url.lastIndexOf("/") + 1); // Extract the filename from the URL
      anchor.style.display = "none";

      // Append the anchor to the document and simulate a click to trigger the download
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up by revoking the temporary URL
      URL.revokeObjectURL(blobURL);
    })
    .catch((error) => console.error("Error downloading the file:", error));
}

export function getFileUrl(file) {
  return ApiUrls.storage.preview(file);
}

export function intParser(string, fallback = null) {
  if (string === undefined || string === null || isNaN(string)) {
    return fallback != null ? fallback : 0;
  }
  if (string === "") return fallback != null ? fallback : 0;
  const res = /^\d+$/.test(string) ? parseInt(string) : parseFloat(string);
  return typeof res === "number" ? res : fallback != null ? fallback : 0;
}

export function setFormErrors(errors, fields, setError) {
  if (errors && errors.length > 0) {
    errors.forEach((i) => {
      if (fields && fields.hasOwnProperty(i.name)) {
        setError(i.name, { type: "server-error", message: i.errors[0] });
      }
    });
  }
}
