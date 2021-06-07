const axios = require("axios");
const { AwesomeKey } = require("./getKey");

const languageMapper = (lang_mode) => {
  switch (lang_mode) {
    case "cpp":
      return { language: "cpp14", versionIndex: "3" };
    case "python":
      return { language: "python3", versionIndex: "3" };
    case "java":
      return { language: "java", versionIndex: "3" };
    case "kotlin":
      return { language: "kotlin", versionIndex: "2" };
    case "sql":
      return { language: "sql", versionIndex: "3" };
    case "go":
      return { language: "go", versionIndex: "3" };
    case "scala":
      return { language: "scala", versionIndex: "3" };
    case "shell":
      return { language: "bash", versionIndex: "3" };
    case "pascal":
      return { language: "pascal", versionIndex: "2" };
    case "csharp":
      return { language: "csharp", versionIndex: "3" };
    case "php":
      return { language: "php", versionIndex: "3" };
    case "perl":
      return { language: "perl", versionIndex: "3" };
    case "ruby":
      return { language: "ruby", versionIndex: "3" };
    case "swift":
      return { language: "swift", versionIndex: "3" };
    case "lua":
      return { language: "lua", versionIndex: "2" };
    case "rust":
      return { language: "rust", versionIndex: "3" };
    case "r":
      return { language: "r", versionIndex: "3" };
    case "nodejs":
      return { language: "nodejs", versionIndex: "3" };
  }
  console.log("Error laguage not defined");
  return {};
};

const compilerFunc = async (lang, code, input) => {
  const { language, versionIndex } = languageMapper(lang);
  console.log("lang:", lang, "code:", code, "input:", input);
  const url = "https://api.jdoodle.com/v1/execute";
  const [clientId, clientSecret] = AwesomeKey();
  console.log("keys", clientId, clientSecret);

  const sendData = {
    clientId,
    clientSecret,
    script: code,
    stdin: input,
    language,
    versionIndex,
  };

  let response = {};
  try {
    response = await axios({
      method: "post", //you can set what request you want to be
      url,
      data: sendData,
    });
  } catch (e) {
    response = e;
    return {
      data: {
        e:
          "Error:404\nOops Something went wrong\nIt seems you are offline\n:-(",
      },
    };
  }
  return response;
};

module.exports = {
  compilerFunc,
};
