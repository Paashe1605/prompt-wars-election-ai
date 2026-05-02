import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Sun, Moon, Volume2, Pause, Video as YoutubeIcon, Globe, Newspaper, MapPin, ChevronDown, Calendar, Map, MessageCircle, ExternalLink, Shield } from 'lucide-react'
const uiTranslations = {
  English: { appTitle: "Global Election Navigator", appSubtitle: "Your Non-Partisan Electoral Guide", currentLocation: "Current Location", verified: "Verified", preferredLanguage: "Preferred Language", retrieveBtn: "Retrieve Election Data", loadingCoordinates: "Acquiring coordinates...", generatingIntel: "Generating Intelligence...", audioBriefing: "Audio Briefing", electionTimelines: "Election Timelines", saveToCalendar: "Save to Calendar", votingProcedures: "Voting Procedures", helpfulResources: "Helpful Resources", infoSynthesizedFor: "Information synthesized for:", countdownTitle: "Time Until Next Election", days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs", findPollingStation: "Nearest Polling Station", shareOnWhatsApp: "Share Guide", politicalLandscape: "Political Landscape", currentLeadership: "Current Leadership", keyCandidates: "Key Candidates", awaitingNomination: "Awaiting Nomination" },
  Spanish: { appTitle: "Navegador Electoral Global", appSubtitle: "Su Guía Electoral No Partidista", currentLocation: "Ubicación Actual", verified: "Verificado", preferredLanguage: "Idioma Preferido", retrieveBtn: "Recuperar Datos Electorales", loadingCoordinates: "Adquiriendo coordenadas...", generatingIntel: "Generando Inteligencia...", audioBriefing: "Resumen de Audio", electionTimelines: "Cronogramas Electorales", saveToCalendar: "Guardar en Calendario", votingProcedures: "Procedimientos de Votación", helpfulResources: "Recursos Útiles", infoSynthesizedFor: "Información sintetizada para:", countdownTitle: "Tiempo hasta la próxima elección", days: "Días", hours: "Horas", minutes: "Min", seconds: "Seg", findPollingStation: "Centro de votación más cercano", shareOnWhatsApp: "Compartir guía", politicalLandscape: "Panorama Político", currentLeadership: "Liderazgo Actual", keyCandidates: "Candidatos Clave", awaitingNomination: "A la espera de nominación" },
  French: { appTitle: "Navigateur Électoral Mondial", appSubtitle: "Votre Guide Électoral Non Partisan", currentLocation: "Emplacement Actuel", verified: "Vérifié", preferredLanguage: "Langue Préférée", retrieveBtn: "Récupérer les Données Électorales", loadingCoordinates: "Acquisition des coordonnées...", generatingIntel: "Génération de l'intelligence...", audioBriefing: "Résumé Audio", electionTimelines: "Calendriers Électoraux", saveToCalendar: "Enregistrer dans le Calendrier", votingProcedures: "Procédures de Vote", helpfulResources: "Ressources Utiles", infoSynthesizedFor: "Informations synthétisées pour :", countdownTitle: "Temps avant la prochaine élection", days: "Jours", hours: "Heures", minutes: "Min", seconds: "Sec", findPollingStation: "Bureau de vote le plus proche", shareOnWhatsApp: "Partager le guide", politicalLandscape: "Paysage Politique", currentLeadership: "Direction Actuelle", keyCandidates: "Candidats Clés", awaitingNomination: "En attente de nomination" },
  German: { appTitle: "Globaler Wahl-Navigator", appSubtitle: "Ihr Überparteilicher Wahlführer", currentLocation: "Aktueller Standort", verified: "Verifiziert", preferredLanguage: "Bevorzugte Sprache", retrieveBtn: "Wahldaten Abrufen", loadingCoordinates: "Koordinaten erfassen...", generatingIntel: "Informationen werden generiert...", audioBriefing: "Audio-Zusammenfassung", electionTimelines: "Wahltermine", saveToCalendar: "Im Kalender Speichern", votingProcedures: "Wahlverfahren", helpfulResources: "Hilfreiche Ressourcen", infoSynthesizedFor: "Informationen synthetisiert für:", countdownTitle: "Zeit bis zur nächsten Wahl", days: "Tage", hours: "Std.", minutes: "Min.", seconds: "Sek.", findPollingStation: "Nächstgelegenes Wahllokal", shareOnWhatsApp: "Leitfaden teilen", politicalLandscape: "Politische Landschaft", currentLeadership: "Aktuelle Führung", keyCandidates: "Schlüsselkandidaten", awaitingNomination: "Warten auf Nominierung" },
  Hindi: { appTitle: "वैश्विक चुनाव नेविगेटर", appSubtitle: "आपका निष्पक्ष चुनावी मार्गदर्शक", currentLocation: "वर्तमान स्थान", verified: "सत्यापित", preferredLanguage: "पसंदीदा भाषा", retrieveBtn: "चुनाव डेटा प्राप्त करें", loadingCoordinates: "निर्देशांक प्राप्त कर रहे हैं...", generatingIntel: "जानकारी उत्पन्न की जा रही है...", audioBriefing: "ऑडियो ब्रीफिंग", electionTimelines: "चुनाव समय-सीमा", saveToCalendar: "कैलेंडर में सहेजें", votingProcedures: "मतदान प्रक्रियाएं", helpfulResources: "उपयोगी संसाधन", infoSynthesizedFor: "के लिए जानकारी संश्लेषित की गई:", countdownTitle: "अगले चुनाव में शेष समय", days: "दिन", hours: "घंटे", minutes: "मिनट", seconds: "सेकंड", findPollingStation: "निकटतम मतदान केंद्र", shareOnWhatsApp: "गाइड साझा करें", politicalLandscape: "राजनीतिक परिदृश्य", currentLeadership: "वर्तमान नेतृत्व", keyCandidates: "प्रमुख उम्मीदवार", awaitingNomination: "नामांकन की प्रतीक्षा" },
  Gujarati: { appTitle: "વૈશ્વિક ચૂંટણી નેવિગેટર", appSubtitle: "તમારો નિષ્પક્ષ ચૂંટણી માર્ગદર્શક", currentLocation: "વર્તમાન સ્થાન", verified: "ચકાસાયેલ", preferredLanguage: "પસંદગીની ભાષા", retrieveBtn: "ચૂંટણી ડેટા મેળવો", loadingCoordinates: "કોઓર્ડિનેટ્સ મેળવી રહ્યા છીએ...", generatingIntel: "માહિતી જનરેટ થઈ રહી છે...", audioBriefing: "ઓડિયો બ્રીફिंग", electionTimelines: "ચૂંટણી સમયરેખા", saveToCalendar: "કેલેન્ડરમાં સાચવો", votingProcedures: "મતદાન પ્રક્રિયાઓ", helpfulResources: "ઉપયોગી સંસાધનો", infoSynthesizedFor: "માટે માહિતી સંશ્લેષિત:", countdownTitle: "આગામી ચૂંટણી સુધીનો સમય", days: "દિવસ", hours: "કલાક", minutes: "મિનિટ", seconds: "સેકન્ડ", findPollingStation: "નજીકનું मतदान કેન્દ્ર", shareOnWhatsApp: "માર્ગદર્શિકા શેર કરો", politicalLandscape: "રાજકીય લેન્ડસ્કેપ", currentLeadership: "વર્તમાન નેતૃત્વ", keyCandidates: "મુખ્ય ઉમેદવારો", awaitingNomination: "નોમિનેશનની રાહ જોવાઈ રહી છે" },
  Marathi: { appTitle: "जागতিক निवडणूक नेव्हिगेटर", appSubtitle: "तुमचा नि:पक्षपाती निवडणूक मार्गदर्शक", currentLocation: "सध्याचे स्थान", verified: "सत्यापित", preferredLanguage: "पसंतीची भाषा", retrieveBtn: "निवडणूक डेटा मिळवा", loadingCoordinates: "કોઓર્ડિનેટ્સ मिळवत आहे...", generatingIntel: "માહિત વ્યુત્પન્ન करत आहे...", audioBriefing: "ऑडिओ ब्रीफिंग", electionTimelines: "निवडणूक वेळापत्रक", saveToCalendar: "कॅलेंडरमध्ये जतन करा", votingProcedures: "મતદાન પ્રક્રિયા", helpfulResources: "ઉપयुક્ત संसाधने", infoSynthesizedFor: "यासाठी માહિતી संश्लेષિત केली:", countdownTitle: "पुढील निवडणुकीपर्यंतची वेळ", days: "દિવસ", hours: "तास", minutes: "मિનિટે", seconds: "सेकंड", findPollingStation: "जवळचे मतदान કેન્દ્ર", shareOnWhatsApp: "માર્ગદર્શક સામાયિક કરા", politicalLandscape: "રાજકીય પરિદૃશ્ય", currentLeadership: "સધ્યાચે નેતૃત્વ", keyCandidates: "પ્રમુખ ઉમેદવાર", awaitingNomination: "નામાંકનાચી પ્રતીક્ષા" },
  Tamil: { appTitle: "உலகளாவிய தேர்தல் வழிகாட்டி", appSubtitle: "உங்கள் நடுநிலையான தேர்தல் வழிகாட்டி", currentLocation: "தற்போதைய இடம்", verified: "சரிபார்க்கப்பட்டது", preferredLanguage: "விருப்பமான மொழி", retrieveBtn: "தேர்தல் தரவைப் பெறுக", loadingCoordinates: "ஆயத்தொலைவுகளைப் பெறுகிறது...", generatingIntel: "தகவலை உருவாக்குகிறது...", audioBriefing: "ஆடியோ சுருக்கம்", electionTimelines: "தேர்தல் காலக்கோடு", saveToCalendar: "நாள்காட்டியில் சேமி", votingProcedures: "வாக்களிப்பு நடைமுறைகள்", helpfulResources: "பயனுள்ள வளங்கள்", infoSynthesizedFor: "தகவல் தொகுக்கப்பட்ட இடம்:", countdownTitle: "அடுத்த தேர்தல் வரை உள்ள நேரம்", days: "நாட்கள்", hours: "மணிநேரம்", minutes: "நிமிடம்", seconds: "வினாடி", findPollingStation: "அருகிலுள்ள வாக்குச்சாவடி", shareOnWhatsApp: "வழிகாட்டியைப் பகிரவும்", politicalLandscape: "அரசியல் நிலவரம்", currentLeadership: "தற்போதைய தலைமை", keyCandidates: "முக்கிய வேட்பாளர்கள்", awaitingNomination: "பரிந்துரைக்காக காத்திருக்கிறது" },
  Telugu: { appTitle: "గ్లోబల్ ఎలక్షన్ నావిగేటర్", appSubtitle: "మీ నిష్పాక్షిక ఎన్నికల మార్గదర్శి", currentLocation: "ప్రస్తుత స్థానం", verified: "ధృవీకరించబడింది", preferredLanguage: "ఇష్టపడే భాష", retrieveBtn: "ఎన్నికల డేటాను పొందండి", loadingCoordinates: "కోఆర్డినేట్లను పొందుతోంది...", generatingIntel: "సమాచారాన్ని ఉత్పత్తి చేస్తోంది...", audioBriefing: "ఆడియో బ్రీఫింగ్", electionTimelines: "ఎన్నికల కాలక్రమం", saveToCalendar: "క్యాలెండర్లో సేవ్ చేయండి", votingProcedures: "ఓటింగ్ విధానాలు", helpfulResources: "ఉపయోగకరమైన వనరులు", infoSynthesizedFor: "సమాచారం సంశ్లేషణ చేయబడింది:", countdownTitle: "తదుపరి ఎన్నికల వరకు సమయం", days: "రోజులు", hours: "గంటలు", minutes: "నిమిషాలు", seconds: "సెకన్లు", findPollingStation: "సమీప పోలింగ్ స్టేషన్", shareOnWhatsApp: "గైడ్ను భాగస్వామ్యం చేయండి", politicalLandscape: "రాజకీయ ముఖచిత్రం", currentLeadership: "ప్రస్తుత నాయకత్వం", keyCandidates: "ముఖ్య అభ్యర్థులు", awaitingNomination: "నామినేషన్ కోసం వేచి ఉంది" },
  Bengali: { appTitle: "গ্লোবাল ইলেকশন নেভিগেটর", appSubtitle: "আপনার নিরপেক্ষ নির্বাচনী গাইড", currentLocation: "বর্তমান অবস্থান", verified: "যাচাইকৃত", preferredLanguage: "পছন্দের ভাষা", retrieveBtn: "নির্বাচনী ডেটা পান", loadingCoordinates: "স্থানাঙ্ক সংগ্রহ করা হচ্ছে...", generatingIntel: "তথ্য তৈরি করা হচ্ছে...", audioBriefing: "অডিও ব্রিফিং", electionTimelines: "নির্বাচনের সময়রেখা", saveToCalendar: "ক্যালেন্ডারে সংরক্ষণ করুন", votingProcedures: "ভোটদানের পদ্ধতি", helpfulResources: "প্রয়োজনীয় সম্পদ", infoSynthesizedFor: "তথ্য সংশ্লেষিত হয়েছে:", countdownTitle: "পরবর্তী নির্বাচন পর্যন্ত সময়", days: "দিন", hours: "ঘন্টা", minutes: "মিনিট", seconds: "সেকেন্ড", findPollingStation: "নিকটস্থ ভোটকেন্দ্র", shareOnWhatsApp: "গাইড শেয়ার করুন", politicalLandscape: "রাজনৈতিক প্রেক্ষাপট", currentLeadership: "বর্তমান নেতৃত্ব", keyCandidates: "মূল প্রার্থী", awaitingNomination: "মনোনয়নের অপেক্ষায়" },
  Kannada: { appTitle: "ಜಾಗತಿಕ ಚುನಾವಣಾ ನ್ಯಾವಿಗೇಟರ್", appSubtitle: "ನಿಮ್ಮ ನಿಷ್ಪಕ್ಷಪಾತ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿ", currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ", verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ", preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ", retrieveBtn: "ಚುನಾವಣಾ ಡೇಟಾವನ್ನು ಪಡೆಯಿರಿ", loadingCoordinates: "ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...", generatingIntel: "ಮಾಹಿತಿಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...", audioBriefing: "ಆಡಿಯೋ ಬ್ರೀಫಿಂಗ್", electionTimelines: "ಚುನಾವಣಾ ಟೈಮ್ಲೈನ್ಗಳು", saveToCalendar: "ಕ್ಯಾಲೆಂಡರ್ಗೆ ಉಳಿಸಿ", votingProcedures: "ಮತದಾನ ಪ್ರಕ್ರಿಯೆಗಳು", helpfulResources: "ಉಪಯುಕ್ತ ಸಂಪನ್ಮೂಲಗಳು", infoSynthesizedFor: "ಮಾಹಿತಿಯನ್ನು ಸಂಶ್ಲೇಷಿಸಲಾಗಿದೆ:", countdownTitle: "ಮುಂದಿನ ಚುನಾವಣೆಗೆ ಉಳಿದ ಸಮಯ", days: "ದಿನಗಳು", hours: "ಗಂಟೆಗಳು", minutes: "ನಿಮಿಷಗಳು", seconds: "ಸೆಕೆಂಡುಗಳು", findPollingStation: "ಹತ್ತಿರದ ಮತಗಟ್ಟೆ", shareOnWhatsApp: "ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ", politicalLandscape: "ರಾಜಕೀಯ ಭೂದೃಶ್ಯ", currentLeadership: "ಪ್ರಸ್ತುತ ನಾಯಕತ್ವ", keyCandidates: "ಪ್ರಮುಖ ಅಭ್ಯರ್ಥಿಗಳು", awaitingNomination: "ನಾಮನಿರ್ದೇಶನಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ" },
  Malayalam: { appTitle: "ഗ്ലോബൽ ഇലക്ഷൻ നാവിഗേറ്റർ", appSubtitle: "നിങ്ങളുടെ നിഷ്പക്ഷമായ തിരഞ്ഞെടുപ്പ് വഴികാട്ടി", currentLocation: "നിലവിലെ സ്ഥാനം", verified: "പരിശോധിച്ചു", preferredLanguage: "തിരഞ്ഞെടുത്ത ഭാഷ", retrieveBtn: "തിരഞ്ഞെടുപ്പ് ഡാറ്റ നേടുക", loadingCoordinates: "കോർഡിനേറ്റുകൾ ശേഖരിക്കുന്നു...", generatingIntel: "വിവരങ്ങൾ ജനറേറ്റ് ചെയ്യുന്നു...", audioBriefing: "ഓഡിയോ ബ്രീഫിംഗ്", electionTimelines: "തിരഞ്ഞെടുപ്പ് സമയരേഖകൾ", saveToCalendar: "കലണ്ടറിൽ സേവ് ചെയ്യുക", votingProcedures: "വോട്ടിംഗ് നടപടിക്രമങ്ങൾ", helpfulResources: "ഉപയോഗപ്രദമായ ഉറവിടങ്ങൾ", infoSynthesizedFor: "വിവരങ്ങൾ സമന്വയിപ്പിച്ചത്:", countdownTitle: "അടുത്ത തിരഞ്ഞെടുപ്പ് വരെയുള്ള സമയം", days: "ദിവസങ്ങൾ", hours: "മണിക്കൂറുകൾ", minutes: "മിനിറ്റുകൾ", seconds: "സെക്കൻഡുകൾ", findPollingStation: "ഏറ്റവും അടുത്തുള്ള പോളിംഗ് സ്റ്റേഷൻ", shareOnWhatsApp: "ഗൈഡ് പങ്കിടുക", politicalLandscape: "രാഷ്ട്രീയ സാഹചര്യം", currentLeadership: "നിലവിലെ നേതൃത്വം", keyCandidates: "പ്രധാന സ്ഥാനാർത്ഥികൾ", awaitingNomination: "നാമനിർദ്ദേശത്തിനായി കാത്തിരിക്കുന്നു" },
  Punjabi: { appTitle: "ਗਲੋਬਲ ਚੋਣ ਨੇਵੀਗੇਟਰ", appSubtitle: "ਤੁਹਾਡੀ ਨਿਰਪੱਖ ਚੋਣ ਗਾਈਡ", currentLocation: "ਮੌਜੂਦਾ ਸਥਾਨ", verified: "ਪ੍ਰਮਾਣਿਤ", preferredLanguage: "ਤਰਜੀਹੀ ਭਾਸ਼ਾ", retrieveBtn: "ਚੋਣ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰੋ", loadingCoordinates: "ਕੋਆਰਡੀਨੇਟ ਪ੍ਰਾਪਤ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...", generatingIntel: "ਜਾਣਕਾਰੀ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", audioBriefing: "ਆਡੀਓ ਬ੍ਰੀਫਿੰਗ", electionTimelines: "ਚੋਣ ਸਮਾਂ-ਸੀਮਾ", saveToCalendar: "ਕੈਲੰਡਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਕਰੋ", votingProcedures: "ਵੋਟ ਪਾਉਣ ਦੀਆਂ ਪ੍ਰਕਿਰਿਆਵਾਂ", helpfulResources: "ਮਦਦਗਾਰ ਸਰੋਤ", infoSynthesizedFor: "ਜਾਣਕਾਰੀ ਲਈ ਸੰਸ਼ਲੇਸ਼ਿਤ:", countdownTitle: "ਅਗਲੀਆਂ ਚੋਣਾਂ ਤੱਕ ਦਾ ਸਮਾਂ", days: "ਦਿਨ", hours: "ਘੰਟੇ", minutes: "ਮਿੰਟ", seconds: "ਸਕਿੰਟ", findPollingStation: "ਨੇੜਲਾ ਪੋਲਿੰਗ ਸਟੇਸ਼ਨ", shareOnWhatsApp: "ਗਾਈਡ ਸਾਂਝਾ ਕਰੋ", politicalLandscape: "ਸਿਆਸੀ ਦ੍ਰਿਸ਼", currentLeadership: "ਮੌਜੂਦਾ ਲੀਡਰਸ਼ਿਪ", keyCandidates: "ਪ੍ਰਮੁੱਖ ਉਮੀਦਵਾਰ", awaitingNomination: "ਨਾਮਜ਼ਦਗੀ ਦੀ ਉਡੀਕ" }
};

function App() {
  const [theme, setTheme] = useState('light')
  const [location, setLocation] = useState({ lat: null, lon: null })
  const [language, setLanguage] = useState('English')
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const [audioDataVoting, setAudioDataVoting] = useState(null)
  const [isPlayingVoting, setIsPlayingVoting] = useState(false)
  const audioRefVoting = useRef(null)

  const [audioDataPolitics, setAudioDataPolitics] = useState(null)
  const [isPlayingPolitics, setIsPlayingPolitics] = useState(false)
  const audioRefPolitics = useRef(null)

  const [error, setError] = useState(null)
  const [humanLocation, setHumanLocation] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const t = uiTranslations[language] || uiTranslations['English'];

  // Toggle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Live Countdown
  useEffect(() => {
    if (!result?.response?.next_election_date || result.response.next_election_date === "Unknown") {
      setTimeLeft(null);
      return;
    }

    const targetDate = new Date(result.response.next_election_date);
    if (isNaN(targetDate)) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Get Geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
          axios.get(`http://localhost:8000/api/location?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => setHumanLocation(res.data.location))
            .catch(console.error)
          setIsLoadingLocation(false)
        },
        (err) => {
          console.error("Error getting location:", err)
          setError("Failed to retrieve your location. Please ensure location services are enabled.")
          setIsLoadingLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setIsLoadingLocation(false)
    }
  }, [])

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!location.lat || !location.lon) {
      setError("Cannot submit without location coordinates.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setResult(null)
    setAudioData(null)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setAudioDataVoting(null)
    setIsPlayingVoting(false)
    if (audioRefVoting.current) {
      audioRefVoting.current.pause()
      audioRefVoting.current = null
    }

    setAudioDataPolitics(null)
    setIsPlayingPolitics(false)
    if (audioRefPolitics.current) {
      audioRefPolitics.current.pause()
      audioRefPolitics.current = null
    }

    try {
      const response = await axios.post('http://localhost:8000/api/election-guide', {
        latitude: location.lat,
        longitude: location.lon,
        language: language
      })

      const payload = response.data
      setResult(payload)

      if (payload.audio_base64) {
        setAudioData(payload.audio_base64)
      }
      if (payload.audio_base64_voting) {
        setAudioDataVoting(payload.audio_base64_voting)
      }
      if (payload.audio_base64_politics) {
        setAudioDataPolitics(payload.audio_base64_politics)
      }

    } catch (err) {
      console.error("API error:", err)
      setError("Failed to fetch election information. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Audio Play/Pause
  const toggleAudio = () => {
    if (!audioData) return

    if (!audioRef.current) {
      audioRef.current = new Audio(audioData)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleAudioVoting = () => {
    if (!audioDataVoting) return

    if (!audioRefVoting.current) {
      audioRefVoting.current = new Audio(audioDataVoting)
      audioRefVoting.current.onended = () => setIsPlayingVoting(false)
    }

    if (isPlayingVoting) {
      audioRefVoting.current.pause()
      setIsPlayingVoting(false)
    } else {
      audioRefVoting.current.play()
      setIsPlayingVoting(true)
    }
  }

  const toggleAudioPolitics = () => {
    if (!audioDataPolitics) return

    if (!audioRefPolitics.current) {
      audioRefPolitics.current = new Audio(audioDataPolitics)
      audioRefPolitics.current.onended = () => setIsPlayingPolitics(false)
    }

    if (isPlayingPolitics) {
      audioRefPolitics.current.pause()
      setIsPlayingPolitics(false)
    } else {
      audioRefPolitics.current.play()
      setIsPlayingPolitics(true)
    }
  }

  const handleSaveToCalendar = (dateStr) => {
    if (!dateStr || dateStr === "Unknown") return;
    const date = new Date(dateStr);
    if (isNaN(date)) return;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Global Election Navigator//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@electionnavigator.com`,
      `DTSTAMP:${year}${month}${day}T000000Z`,
      `DTSTART;VALUE=DATE:${year}${month}${day}`,
      `DTEND;VALUE=DATE:${year}${month}${day}`,
      "SUMMARY:Upcoming Election",
      "DESCRIPTION:Remember to verify your polling station and cast your vote! Check the Global Election Navigator for official links.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'election.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex justify-center">
      <div className="w-full flex flex-col">
        {/* Header */}
        <header className={`sticky top-0 z-10 w-full border-b backdrop-blur-md ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} shadow-sm`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold tracking-tight">{t.appTitle}</h1>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* Intro Section */}
          <div className="text-center space-y-4">
            <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{t.appSubtitle}</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time, personalized voting information localized to your region and language.
            </p>
          </div>

          {/* Input Card */}
          <div className={`rounded-2xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} transition-colors duration-300`}>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Location Status */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-semibold tracking-wide uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.currentLocation}
                    </label>
                    <div className={`flex items-center p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      {isLoadingLocation ? (
                        <div className="flex items-center w-full">
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mr-3"></div>
                          <span className="text-sm">{t.loadingCoordinates}</span>
                        </div>
                      ) : error && !location.lat ? (
                        <div className="text-red-500 text-sm">{error}</div>
                      ) : (
                        <div className="flex items-center w-full">
                          <MapPin className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                          <span className="font-mono text-sm tracking-tight truncate">{humanLocation || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}</span>
                          <span className={`ml-auto text-xs px-2 py-1 rounded-full shrink-0 ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>{t.verified}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-3">
                    <label htmlFor="language" className={`block text-sm font-semibold tracking-wide uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.preferredLanguage}
                    </label>
                    <div className="relative">
                      <select
                        id="language"
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`block w-full rounded-xl border appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 pr-10 transition-colors ${theme === 'dark'
                            ? 'bg-slate-900/50 border-slate-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                      >
                        <optgroup label="International Languages">
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </optgroup>
                        <optgroup label="Indian Languages">
                          <option value="Hindi">Hindi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Punjabi">Punjabi</option>
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                        <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingLocation || !location.lat || isSubmitting}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-3"></div>
                      {t.generatingIntel}
                    </>
                  ) : (
                    t.retrieveBtn
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Error State */}
          {error && isSubmitting === false && location.lat && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-800 dark:text-red-300">
              <h3 className="font-semibold flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                An Error Occurred
              </h3>
              <p>{error}</p>
            </div>
          )}

          {/* Results Area */}
          {result && result.response && !result.response.error && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Location Banner */}
              <div className={`px-4 py-3 rounded-lg border flex items-center text-sm font-medium ${theme === 'dark' ? 'bg-indigo-900/30 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-800'}`}>
                <MapPin className="w-4 h-4 mr-2" />
                {t.infoSynthesizedFor} <span className="ml-1 font-bold">{result.location_identified}</span>
              </div>

              {/* Audio Briefing Card */}
              {result.response.audio_summary && (
                <div className={`p-6 md:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} relative overflow-hidden group`}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${isPlaying ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'} transition-colors`}></div>
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <button
                      onClick={toggleAudio}
                      disabled={!audioData}
                      className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${isPlaying
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                          : theme === 'dark' ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      aria-label={isPlaying ? 'Pause audio briefing' : 'Play audio briefing'}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Volume2 className="w-8 h-8 ml-1" />}
                    </button>
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.audioBriefing}</h3>
                      <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                        {result.response.audio_summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timeline Card */}
                {result.response.timeline && (
                  <div className={`p-6 md:p-8 rounded-2xl shadow-lg border flex flex-col h-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`flex items-center justify-between border-b pb-4 mb-6 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {t.electionTimelines}
                      </h3>
                      {result.response.next_election_date && result.response.next_election_date !== "Unknown" && (
                        <button
                          onClick={() => handleSaveToCalendar(result.response.next_election_date)}
                          className={`flex items-center text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${theme === 'dark'
                              ? 'border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200'
                              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {t.saveToCalendar}
                        </button>
                      )}
                    </div>
                    <div className={`prose max-w-none flex-grow ${theme === 'dark' ? 'prose-invert prose-p:text-slate-300 prose-li:text-slate-300' : 'prose-slate prose-p:text-slate-600 prose-li:text-slate-600'}`}>
                      {timeLeft && (
                        <div className="mb-6">
                          <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.countdownTitle}</p>
                          <div className="flex space-x-2 sm:space-x-4">
                            {[
                              { label: t.days, value: timeLeft.days },
                              { label: t.hours, value: timeLeft.hours },
                              { label: t.minutes, value: timeLeft.minutes },
                              { label: t.seconds, value: timeLeft.seconds }
                            ].map((item, idx) => (
                              <div key={idx} className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border w-16 sm:w-20 shadow-inner ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                <span className={`text-xl sm:text-2xl font-bold font-mono tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{String(item.value).padStart(2, '0')}</span>
                                <span className={`text-[10px] sm:text-xs uppercase mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 mt-2 flex-grow">
                        {Array.isArray(result.response.timeline) ? result.response.timeline.map((event, idx) => (
                          <div key={idx} className="relative pl-8">
                            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800 shadow-sm shadow-blue-500/50"></div>
                            <div className={`mt-2 mb-8 ml-8 p-5 rounded-xl border shadow-sm transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{event.date}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                  {event.level}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold">{event.title}</h4>
                              <p className={`mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{event.description}</p>
                            </div>
                          </div>
                        )) : (
                          <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Timeline data is unavailable.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting Steps Card */}
                {result.response.voting_steps && result.response.voting_steps.length > 0 && (
                  <div className={`p-6 md:p-8 rounded-2xl shadow-lg border flex flex-col ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center border-b pb-4 ${theme === 'dark' ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                      {t.votingProcedures}
                    </h3>
                    
                    {/* Voting Audio Player */}
                    {audioDataVoting && (
                      <div className={`mb-6 border-b pb-6 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Audio Briefing</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI Synthesized Voice</p>
                            </div>
                          </div>
                          <button
                            onClick={toggleAudioVoting}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            {isPlayingVoting ? (
                              <>
                                <Pause className="w-4 h-4" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4" />
                                <span>Play</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 mt-2 flex-grow">
                      {result.response.voting_steps.map((step, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className="absolute -left-[17px] bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm shadow-md">
                            {step.step_number}
                          </div>
                          <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{step.title}</h4>
                          <p className={`mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Political Landscape Card */}
              {result.response && (result.response.ruling_parties || result.response.key_candidates) && (
                <div className={`p-6 md:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t.politicalLandscape}
                  </h3>

                  {/* Political Landscape Audio Player */}
                  {audioDataPolitics && (
                    <div className={`mb-6 border-b pb-6 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Audio Briefing</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI Synthesized Voice</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleAudioPolitics}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          {isPlayingPolitics ? (
                            <>
                              <Pause className="w-4 h-4" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>Play</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                      <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.currentLeadership}</h4>
                      <div className="space-y-4">
                        {result.response.ruling_parties?.map((party, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-4 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="mt-1">
                              <Shield className="w-6 h-6" style={{ color: party.party_color }} />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>{party.level}</span>
                              </div>
                              <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{party.party_name}</p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{party.leader_name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Right Column */}
                    <div>
                      <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t.keyCandidates}</h4>
                      <div className="space-y-4">
                        {result.response.key_candidates?.map((candidate, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-4 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="mt-1">
                              <Shield className="w-6 h-6" style={{ color: candidate.party_color }} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{candidate.party_name}</p>
                              <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{candidate.candidate_name === 'Awaiting official party nomination' ? t.awaitingNomination : candidate.candidate_name}</p>
                              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{candidate.portfolio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Card */}
              {result.response.resources && result.response.resources.length > 0 && (
                <div className={`p-6 md:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t.helpfulResources}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {result.response.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                            ? 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-700/50'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                      >
                        <div className="mr-4 flex-shrink-0">
                          {resource.type === 'youtube' && <YoutubeIcon className="w-8 h-8 text-red-500" />}
                          {resource.type === 'official' && <Globe className="w-8 h-8 text-blue-500" />}
                          {resource.type === 'news' && <Newspaper className="w-8 h-8 text-slate-500 dark:text-slate-400" />}
                          {!['youtube', 'official', 'news'].includes(resource.type) && <Globe className="w-8 h-8 text-indigo-500" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className={`font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                            {resource.title}
                          </p>
                          <p className={`text-xs truncate mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                            {resource.url}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Civic Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => window.open('https://electoralsearch.eci.gov.in/', '_blank')}
                      className={`flex items-center justify-center p-4 rounded-xl shadow-md border transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                          ? 'bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30'
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        }`}
                    >
                      <ExternalLink className="w-5 h-5 mr-2 shrink-0" />
                      {t.findPollingStation}
                    </button>
                    <button
                      onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${t.appTitle}* - ${result.location_identified}\n\n*${t.electionTimelines}:* ${result.response.next_election_date}\n\n*${t.audioBriefing}:*\n${result.response.audio_summary}\n\n📍 Generate your own report at: [INSERT_LIVE_URL_HERE]`)}`, '_blank')}
                      className={`flex items-center justify-center p-4 rounded-xl shadow-md border transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'dark'
                          ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                      <MessageCircle className="w-5 h-5 mr-2 shrink-0" />
                      {t.shareOnWhatsApp}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
