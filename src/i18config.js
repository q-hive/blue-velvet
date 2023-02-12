import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const apiKey = "srPQPrEC5YE5bVrK2ic6Sw";
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

i18next
    .use(I18NextHttpBackend)
    .use(initReactI18next)
    .init({
        "fallbackLng":"en",
        "ns": ["default", "daily_tasks_cards"],
        "defaultNS": "default",

        "supportedLngs": ["en","zh","de", "fr", "it"],
        
        "backend": {
            "loadPath": loadPath
        }
    })

export default i18next
    