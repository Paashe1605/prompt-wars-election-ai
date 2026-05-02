import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Sun, Moon, Volume2, Pause, Video as YoutubeIcon, Globe, Newspaper, MapPin, ChevronDown, Calendar } from 'lucide-react'
const uiTranslations = {
  English: { appTitle: "Global Election Navigator", appSubtitle: "Your Non-Partisan Electoral Guide", currentLocation: "Current Location", verified: "Verified", preferredLanguage: "Preferred Language", retrieveBtn: "Retrieve Election Data", loadingCoordinates: "Acquiring coordinates...", generatingIntel: "Generating Intelligence...", audioBriefing: "Audio Briefing", electionTimelines: "Election Timelines", saveToCalendar: "Save to Calendar", votingProcedures: "Voting Procedures", helpfulResources: "Helpful Resources", infoSynthesizedFor: "Information synthesized for:" },
  Spanish: { appTitle: "Navegador Electoral Global", appSubtitle: "Su Guía Electoral No Partidista", currentLocation: "Ubicación Actual", verified: "Verificado", preferredLanguage: "Idioma Preferido", retrieveBtn: "Recuperar Datos Electorales", loadingCoordinates: "Adquiriendo coordenadas...", generatingIntel: "Generando Inteligencia...", audioBriefing: "Resumen de Audio", electionTimelines: "Cronogramas Electorales", saveToCalendar: "Guardar en Calendario", votingProcedures: "Procedimientos de Votación", helpfulResources: "Recursos Útiles", infoSynthesizedFor: "Información sintetizada para:" },
  French: { appTitle: "Navigateur Électoral Mondial", appSubtitle: "Votre Guide Électoral Non Partisan", currentLocation: "Emplacement Actuel", verified: "Vérifié", preferredLanguage: "Langue Préférée", retrieveBtn: "Récupérer les Données Électorales", loadingCoordinates: "Acquisition des coordonnées...", generatingIntel: "Génération de l'intelligence...", audioBriefing: "Résumé Audio", electionTimelines: "Calendriers Électoraux", saveToCalendar: "Enregistrer dans le Calendrier", votingProcedures: "Procédures de Vote", helpfulResources: "Ressources Utiles", infoSynthesizedFor: "Informations synthétisées pour :" },
  German: { appTitle: "Globaler Wahl-Navigator", appSubtitle: "Ihr Überparteilicher Wahlführer", currentLocation: "Aktueller Standort", verified: "Verifiziert", preferredLanguage: "Bevorzugte Sprache", retrieveBtn: "Wahldaten Abrufen", loadingCoordinates: "Koordinaten erfassen...", generatingIntel: "Informationen werden generiert...", audioBriefing: "Audio-Zusammenfassung", electionTimelines: "Wahltermine", saveToCalendar: "Im Kalender Speichern", votingProcedures: "Wahlverfahren", helpfulResources: "Hilfreiche Ressourcen", infoSynthesizedFor: "Informationen synthetisiert für:" },
  Hindi: { appTitle: "वैश्विक चुनाव नेविगेटर", appSubtitle: "आपका निष्पक्ष चुनावी मार्गदर्शक", currentLocation: "वर्तमान स्थान", verified: "सत्यापित", preferredLanguage: "पसंदीदा भाषा", retrieveBtn: "चुनाव डेटा प्राप्त करें", loadingCoordinates: "निर्देशांक प्राप्त कर रहे हैं...", generatingIntel: "जानकारी उत्पन्न की जा रही है...", audioBriefing: "ऑडियो ब्रीफिंग", electionTimelines: "चुनाव समय-सीमा", saveToCalendar: "कैलेंडर में सहेजें", votingProcedures: "मतदान प्रक्रियाएं", helpfulResources: "उपयोगी संसाधन", infoSynthesizedFor: "के लिए जानकारी संश्लेषित की गई:" },
  Gujarati: { appTitle: "વૈશ્વિક ચૂંટણી નેવિગેટર", appSubtitle: "તમારો નિષ્પક્ષ ચૂંટણી માર્ગદર્શક", currentLocation: "વર્તમાન સ્થાન", verified: "ચકાસાયેલ", preferredLanguage: "પસંદગીની ભાષા", retrieveBtn: "ચૂંટણી ડેટા મેળવો", loadingCoordinates: "કોઓર્ડિનેટ્સ મેળવી રહ્યા છીએ...", generatingIntel: "માહિતી જનરેટ થઈ રહી છે...", audioBriefing: "ઓડિયો બ્રીફિંગ", electionTimelines: "ચૂંટણી સમયરેખા", saveToCalendar: "કેલેન્ડરમાં સાચવો", votingProcedures: "મતદાન પ્રક્રિયાઓ", helpfulResources: "ઉપયોગી સંસાધનો", infoSynthesizedFor: "માટે માહિતી સંશ્લેષિત:" },
  Marathi: { appTitle: "जागतिक निवडणूक नेव्हिगेटर", appSubtitle: "तुमचा नि:पक्षपाती निवडणूक मार्गदर्शक", currentLocation: "सध्याचे स्थान", verified: "सत्यापित", preferredLanguage: "पसंतीची भाषा", retrieveBtn: "निवडणूक डेटा मिळवा", loadingCoordinates: "कोऑर्डिनेट्स मिळवत आहे...", generatingIntel: "माहिती व्युत्पन्न करत आहे...", audioBriefing: "ऑडिओ ब्रीफिंग", electionTimelines: "निवडणूक वेळापत्रक", saveToCalendar: "कॅलेंडरमध्ये जतन करा", votingProcedures: "मतदान प्रक्रिया", helpfulResources: "उपयुक्त संसाधने", infoSynthesizedFor: "यासाठी माहिती संश्लेषित केली:" },
  Tamil: { appTitle: "உலகளாவிய தேர்தல் வழிகாட்டி", appSubtitle: "உங்கள் நடுநிலையான தேர்தல் வழிகாட்டி", currentLocation: "தற்போதைய இடம்", verified: "சரிபார்க்கப்பட்டது", preferredLanguage: "விருப்பமான மொழி", retrieveBtn: "தேர்தல் தரவைப் பெறுக", loadingCoordinates: "ஆயத்தொலைவுகளைப் பெறுகிறது...", generatingIntel: "தகவலை உருவாக்குகிறது...", audioBriefing: "ஆடியோ சுருக்கம்", electionTimelines: "தேர்தல் காலக்கோடு", saveToCalendar: "நாள்காட்டியில் சேமி", votingProcedures: "வாக்களிப்பு நடைமுறைகள்", helpfulResources: "பயனுள்ள வளங்கள்", infoSynthesizedFor: "தகவல் தொகுக்கப்பட்ட இடம்:" },
  Telugu: { appTitle: "గ్లోబల్ ఎలక్షన్ నావిగేటర్", appSubtitle: "మీ నిష్పాక్షిక ఎన్నికల మార్గదర్శి", currentLocation: "ప్రస్తుత స్థానం", verified: "ధృవీకరించబడింది", preferredLanguage: "ఇష్టపడే భాష", retrieveBtn: "ఎన్నికల డేటాను పొందండి", loadingCoordinates: "కోఆర్డినేట్‌లను పొందుతోంది...", generatingIntel: "సమాచారాన్ని ఉత్పత్తి చేస్తోంది...", audioBriefing: "ఆడియో బ్రీఫింగ్", electionTimelines: "ఎన్నికల కాలక్రమం", saveToCalendar: "క్యాలెండర్‌లో సేవ్ చేయండి", votingProcedures: "ఓటింగ్ విధానాలు", helpfulResources: "ఉపయోగకరమైన వనరులు", infoSynthesizedFor: "సమాచారం సంశ్లేషణ చేయబడింది:" },
  Bengali: { appTitle: "গ্লোবাল ইলেকশন নেভিগেটর", appSubtitle: "আপনার নিরপেক্ষ নির্বাচনী গাইড", currentLocation: "বর্তমান অবস্থান", verified: "যাচাইকৃত", preferredLanguage: "পছন্দের ভাষা", retrieveBtn: "নির্বাচনী ডেটা পান", loadingCoordinates: "স্থানাঙ্ক সংগ্রহ করা হচ্ছে...", generatingIntel: "তথ্য তৈরি করা হচ্ছে...", audioBriefing: "অডিও ব্রিফিং", electionTimelines: "নির্বাচনের সময়রেখা", saveToCalendar: "ক্যালেন্ডারে সংরক্ষণ করুন", votingProcedures: "ভোটদানের পদ্ধতি", helpfulResources: "প্রয়োজনীয় সম্পদ", infoSynthesizedFor: "তথ্য সংশ্লেষিত হয়েছে:" },
  Kannada: { appTitle: "ಜಾಗತಿಕ ಚುನಾವಣಾ ನ್ಯಾವಿಗೇಟರ್", appSubtitle: "ನಿಮ್ಮ ನಿಷ್ಪಕ್ಷಪಾತ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿ", currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ", verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ", preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ", retrieveBtn: "ಚುನಾವಣಾ ಡೇಟಾವನ್ನು ಪಡೆಯಿರಿ", loadingCoordinates: "ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...", generatingIntel: "ಮಾಹಿತಿಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...", audioBriefing: "ಆಡಿಯೋ ಬ್ರೀಫಿಂಗ್", electionTimelines: "ಚುನಾವಣಾ ಟೈಮ್‌ಲೈನ್‌ಗಳು", saveToCalendar: "ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಉಳಿಸಿ", votingProcedures: "ಮತದಾನ ಪ್ರಕ್ರಿಯೆಗಳು", helpfulResources: "ಉಪಯುಕ್ತ ಸಂಪನ್ಮೂಲಗಳು", infoSynthesizedFor: "ಮಾಹಿತಿಯನ್ನು ಸಂಶ್ಲೇಷಿಸಲಾಗಿದೆ:" },
  Malayalam: { appTitle: "ഗ്ലോബൽ ഇലക്ഷൻ നാവിഗേറ്റർ", appSubtitle: "നിങ്ങളുടെ നിഷ്പക്ഷമായ തിരഞ്ഞെടുപ്പ് വഴികാട്ടി", currentLocation: "നിലവിലെ സ്ഥാനം", verified: "പരിശോധിച്ചു", preferredLanguage: "തിരഞ്ഞെടുത്ത ഭാഷ", retrieveBtn: "തിരഞ്ഞെടുപ്പ് ഡാറ്റ നേടുക", loadingCoordinates: "കോർഡിനേറ്റുകൾ ശേഖരിക്കുന്നു...", generatingIntel: "വിവരങ്ങൾ ജനറേറ്റ് ചെയ്യുന്നു...", audioBriefing: "ഓഡിയോ ബ്രീഫിംഗ്", electionTimelines: "തിരഞ്ഞെടുപ്പ് സമയരേഖകൾ", saveToCalendar: "കലണ്ടറിൽ സേവ് ചെയ്യുക", votingProcedures: "വോട്ടിംഗ് നടപടിക്രമങ്ങൾ", helpfulResources: "ഉപയോഗപ്രദമായ ഉറവിടങ്ങൾ", infoSynthesizedFor: "വിവരങ്ങൾ സമന്വയിപ്പിച്ചത്:" },
  Punjabi: { appTitle: "ਗਲੋਬਲ ਚੋਣ ਨੇਵੀਗੇਟਰ", appSubtitle: "ਤੁਹਾਡੀ ਨਿਰਪੱਖ ਚੋਣ ਗਾਈਡ", currentLocation: "ਮੌਜੂਦਾ ਸਥਾਨ", verified: "ਪ੍ਰਮਾਣਿਤ", preferredLanguage: "ਤਰਜੀਹੀ ਭਾਸ਼ਾ", retrieveBtn: "ਚੋਣ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰੋ", loadingCoordinates: "ਕੋਆਰਡੀਨੇਟ ਪ੍ਰਾਪਤ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...", generatingIntel: "ਜਾਣਕਾਰੀ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", audioBriefing: "ਆਡੀਓ ਬ੍ਰੀਫਿੰਗ", electionTimelines: "ਚੋਣ ਸਮਾਂ-ਸੀਮਾ", saveToCalendar: "ਕੈਲੰਡਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਕਰੋ", votingProcedures: "ਵੋਟ ਪਾਉਣ ਦੀਆਂ ਪ੍ਰਕਿਰਿਆਵਾਂ", helpfulResources: "ਮਦਦਗਾਰ ਸਰੋਤ", infoSynthesizedFor: "ਜਾਣਕਾਰੀ ਲਈ ਸੰਸ਼ਲੇਸ਼ਿਤ:" }
};

function App() {
  const [theme, setTheme] = useState('light')
  const [location, setLocation] = useState({ lat: null, lon: null })
  const [language, setLanguage] = useState('English')
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [humanLocation, setHumanLocation] = useState(null)
  
  const audioRef = useRef(null)
  const t = uiTranslations[language] || uiTranslations['English'];

  // Toggle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

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
                      className={`block w-full rounded-xl border appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 pr-10 transition-colors ${
                        theme === 'dark' 
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
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                      isPlaying 
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
                        className={`flex items-center text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          theme === 'dark' 
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
                    <ReactMarkdown>{result.response.timeline}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Voting Steps Card */}
              {result.response.voting_steps && result.response.voting_steps.length > 0 && (
                <div className={`p-6 md:p-8 rounded-2xl shadow-lg border flex flex-col h-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-bold mb-6 flex items-center border-b pb-4 ${theme === 'dark' ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                    {t.votingProcedures}
                  </h3>
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

            {/* Resources Card */}
            {result.response.resources && result.response.resources.length > 0 && (
              <div className={`p-6 md:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.helpfulResources}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.response.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
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
