import { RefreshCcwIcon } from "lucide-react";
import React, { useState } from "react";

const shayaris = [
  "तेरी ख़ुशबू से महकता है ये दिल का जहां,\nतेरे ज़िक्र से ही मिलती है रूह को पनाह।",
  "तेरी मुस्कान में बसी है मेरी क़ायनात,\nहर ख़ुशी से पहले तेरा नाम आता है।",
  "तेरे होने से है रौशन मेरी तन्हाई,\nवरना चाँद भी लगता था वीराना सा।",
  "मोहब्बत की तालीम तुझसे ही पाई है,\nवरना दिल तो बहुत पहले वीरान था।",
  "तेरी ख़ामोशी भी कुछ कह जाती है,\nहर लफ़्ज़ से गहरी, हर साज़ से प्यारी।",
  "तू मिले तो हर ग़म भी ग़ज़ल बन जाए,\nतेरे बिना तो हर ख़ुशी भी सवाल बन जाए।",
  "तेरा दीदार ही मेरी इबादत है,\nतेरे बिना ये सज़दा अधूरा सा लगता है।",
  "दिल हर पल तुझे याद करता है,\nतेरे नाम से ही सवेरा होता है।",
  "तेरे पहलू में जो सुकून है,\nवो न दुआओं में है, न जन्नत में।",
  "तेरी हर बात में एक नज़्म सी है,\nजैसे अल्फ़ाज़ खुद-ब-खुद शायरी बन जाएं।",
  "तेरे साथ चलूं तो सफ़र आसान लगे,\nवरना राहें भी उलझी सी लगती हैं।",
  "तेरा नाम जब लबों पे आता है,\nदिल खुद-ब-खुद साज पे गाता है।",
  "तू रूठे तो लगता है वक़्त ठहर गया,\nतेरा हँसना ही मेरा मौसम है।",
  "तेरे इश्क़ में जो दर्द मिला,\nवो भी जुदा सा लुत्फ़ देता है।",
  "तेरे बिन ये शामें भी ख़ाली लगती हैं,\nजैसे हर रंग से रोशनी रूठी हो।",
  "मैंने खुद को तुझमें ही पाया है,\nअब हर आइना तेरा अक्स दिखाता है।",
  "तू हो तो हर रोज़ ईद सी लगे,\nतेरे बिना दिल बस रोज़े में रहे।",
  "तेरा नाम लबों पर आए जब,\nहर दर्द भी फूल सा मुस्काए तब।",
  "तेरे इश्क़ में जो हाल हुआ,\nवो किसी फ़लसफ़े में बयान नहीं होता।",
  "तू ही मेरी ग़ज़ल, तू ही मेरी दुआ,\nतेरे बिना हर साँस अधूरी सी लगे।",
];

const ComplimentGenerator = () => {
  const [currentShayari, setCurrentShayari] = useState(shayaris[0]);

  const renderShayari = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <div className="text-lg text-purple-700 mb-4 animate-fade-in text-center px-4">
        {renderShayari(currentShayari)}
      </div>
      <button
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-md flex items-center justify-center mx-auto"
        onClick={() =>
          setCurrentShayari(
            shayaris[Math.floor(Math.random() * shayaris.length)]
          )
        }
      >
        <RefreshCcwIcon />
      </button>
    </div>
  );
};

export default ComplimentGenerator;
