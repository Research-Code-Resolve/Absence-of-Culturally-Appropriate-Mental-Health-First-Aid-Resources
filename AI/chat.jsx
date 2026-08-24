import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

function Chatbot() {
  const [language, setLanguage] = useState("")
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [alert, setAlert] = useState("")
  const chatEndRef = useRef(null) // for auto-scroll

  // Auto scroll to bottom when new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const langData = {
    en: {
      welcome: "Hi! I'm here to listen. How are you feeling today?",
      crisisAlert: "⚠️ ALERT: I’m worried about you. Kenya: Call 1199 or 0800 720 080. Talk to someone you trust.",
      crisisReplies: [
        "I’m so sorry you’re feeling this way. Please don’t go through this alone. Can you talk to someone right now? You matter.",
        "That sounds really heavy. I care about you. Please reach out to 1199 or a friend. You’re not alone in this.",
        "I hear how much pain you’re in. Let’s get you some help. Can you call 1199 or talk to someone you trust?"
      ],
      stressReplies: [
        "I hear you. School stress can be a lot. Have you tried taking a break? What’s making you feel stressed?",
        "That sounds tough. Stress ya campus is real. Do you want to talk through what’s bothering you?",
        "I get it. When things pile up it’s overwhelming. What’s on your mind right now?"
      ],
      happyReplies: [
        "That’s amazing! I’m happy to hear you’re doing well 😊 What’s making you happy today?",
        "Yesss! Love to hear that! Tell me what’s going good?",
        "So good to hear! What’s been the highlight of your day?"
      ],
      sadReplies: [
        "I’m sorry you’re feeling down. Do you want to talk about what’s making you feel this way? I’m listening.",
        "Pole. That’s hard. I’m here for you. Want to share what’s going on?",
        "I hear you. Feeling low is tough. Do you feel like talking about it?"
      ],
      defaultReplies: [
        "Thanks for sharing. Tell me more about that?",
        "I get you. What’s been on your mind lately?",
        "That makes sense. How has your day been going?",
        "I’m listening. What else is going on?"
      ],
      placeholder: "Type your message here...",
      clearBtn: "Clear Chat"
    },
    sw: {
      welcome: "Habari! Niko hapa kuskiza. Unajisikiaje leo?",
      crisisAlert: "⚠️ TAHADHARI: Nina wasiwasi nawe. Kenya: Piga 1199 au 0800 720 080. Ongea na mtu unayemwamini.",
      crisisReplies: [
        "Pole sana. Najua ni vigumu. Tafadhali usipitie haya peke yako. Unaweza kuongea na mshauri? Wewe ni muhimu.",
        "Nimesikia unaumizwa. Usijipe mzigo peke yako. Tafadhali piga 1199 au ongea na rafiki. Niko na wewe.",
        "Pole rafiki. Maisha ni ya thamani. Hebu tupate msaada. Unaweza kupiga simu sasa?"
      ],
      stressReplies: [
        "Nakuelewa. Msongo wa shule unaweza kuwa mwingi. Umejaribu kupumua? Nini kinakusumbua?",
        "Pole. Najua pressure ya masomo ni mob. Unataka tuongee kuhusu nini kimekulemea?",
        "Nakusikia. Wakati mwingine mambo yanakuwa mengi. Ni nini hasa kinakusumbua?"
      ],
      happyReplies: [
        "Vizuri sana! Nafurahi kuskia uko poa 😊 Nini kimekufurahisha leo?",
        "Hongera! Ni vizuri kusikia hivyo. Niambie nini kizuri kimetokea?",
        "Nafurahi kwa ajili yako! Siku yako imekuwaje?"
      ],
      sadReplies: [
        "Pole kwa kusikia hivyo. Unataka kuongea kuhusu nini kinakufanya uhuzunike? Niko hapa kuskiza.",
        "Samahani unapitia hivyo. Niko hapa nawe. Ungependa kushare?",
        "Nakuelewa. Kuhuzunika ni kawaida. Unataka kuniambia zaidi?"
      ],
      defaultReplies: [
        "Asante kwa kushare. Niambie zaidi?",
        "Nakuelewa. Nini kiko akilini mwako siku hizi?",
        "Hiyo ina maana. Siku yako imekuwaje?",
        "Niko hapa kuskiza. Kuna kingine?"
      ],
      placeholder: "Andika ujumbe wako hapa...",
      clearBtn: "Futa Mazungumzo"
    },
    sh: {
      welcome: "Sasa! Niko hapa kuskiza. Uko aje leo?",
      crisisAlert: "⚠️ ALERT: Nimeworry na wewe. Kenya: Piga 1199 au 0800 720 080. Ongea na mtu unatrust.",
      crisisReplies: [
        "Pole sana bro/sis. Najua life inakua tough. Usikam through hii peke yako. Unaweza kuongea na counselor? You matter sana.",
        "Ayy pole. I know ni ngumu. Tafadhali usifeel peke yako. Piga 1199 ama ongea na mtu. We got you.",
        "Nakusikia. Hii sio mzaha. Let’s get you help. Unaweza call 1199 ama rafiki yako?"
      ],
      stressReplies: [
        "Nakusikia. Stress ya campus inaeza kuwa mob. Umejaribu kupumua ama kuongea na mtu? Nini inakupea stress?",
        "Eish pressure ni mob. Najua. Unataka tushare nini imekulemea?",
        "I feel you. Campus life inaweza kuwa hectic. Ni nini haswa?"
      ],
      happyReplies: [
        "Poa sana! Nimefurahi kusikia uko sawa 😊 Nini imekufanya ufeel poa leo?",
        "Yesss! I love that for you! Ni nini poa imekufanyika?",
        "Wueh nice! Tell me, nini kimekufanya ukae sawa?"
      ],
      sadReplies: [
        "Pole. Sorry unasikia down. Unataka tuongee about inakusumbua? Niko hapa na wewe.",
        "Ayy pole. Najua inakua ngumu. Unafeel kuongea?",
        "Nakuelewa. Kuwa down ni normal. Unataka kushare?"
      ],
      defaultReplies: [
        "Thanks kwa kushare. Niambie more?",
        "Nakuelewa. Nini iko kwa mind yako hizi siku?",
        "Ina-make sense. Day yako imekua aje?",
        "Niko hapa. Kuna ingine unataka kuongea?"
      ],
      placeholder: "Andika hapa...",
      clearBtn: "Futa Chat"
    }
  }

  const crisisWords = {
    en: ["kill myself", "suicide", "want to die", "wanna die", "end my life", "no point living", "i give up", "better off dead"],
    sw: ["kujiua", "sitaki kuishi", "kufariki", "nijinyonge", "nimalize maisha", "nimechoka kuishi"],
    sh: ["nimalizie", "niwache", "sina hope", "nimechoka na life", "wacha nife", "siwezi tena"]
  }

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    setMessages([{text: langData[lang].welcome, sender: "bot"}])
    setAlert("")
  }

  const handleClear = () => {
    setMessages([{text: langData[language].welcome, sender: "bot"}])
    setAlert("")
  }

  const handleSend = () => {
    if (!input.trim() ||!language) return;
    
    const userMsg = {text: input, sender: "user"}
    setMessages(prev => [...prev, userMsg])
    
    const lowerInput = input.toLowerCase()
    const data = langData[language]
    
    const isCrisis = [...crisisWords.en,...crisisWords.sw,...crisisWords.sh].some(word => lowerInput.includes(word))
    
    const stressWords = language === 'en'? ["stress", "anxious", "worried", "pressure"] : language === 'sw'? ["msongo", "naogopa", "worry", "pressure"] : ["stress", "pressure", "naogopa"]
    const happyWords = language === 'en'? ["happy", "good", "great", "amazing"] : language === 'sw'? ["furahi", "nzuri", "sawa", "poa"] : ["poa", "sawa", "niko sawa", "furahi"]
    const sadWords = language === 'en'? ["sad", "down", "lonely", "depressed"] : language === 'sw'? ["huzuni", "pweke", "nateseka", "huzuni"] : ["down", "lonely", "nateseka", "huzuni"]
    
    let botText = ""
    let replyPool = []
    
    if (isCrisis) {
      setAlert(data.crisisAlert)
      replyPool = data.crisisReplies
    } 
    else if (stressWords.some(word => lowerInput.includes(word))) {
      setAlert("")
      replyPool = data.stressReplies
    }
    else if (happyWords.some(word => lowerInput.includes(word))) {
      setAlert("")
      replyPool = data.happyReplies
    }
    else if (sadWords.some(word => lowerInput.includes(word))) {
      setAlert("")
      replyPool = data.sadReplies
    }
    else {
      setAlert("")
      replyPool = data.defaultReplies
    }

    botText = replyPool[Math.floor(Math.random() * replyPool.length)]

    const botReply = {text: botText, sender: "bot"}
    setMessages(prev => [...prev, botReply])
    setInput("")
  }

  if (!language) {
    return (
      <div style={{padding: "40px", fontFamily: "Arial", textAlign: "center", maxWidth: "500px", margin: "auto"}}>
        <h1>MHFA Chatbot - Nairobi</h1>
        <p>Chagua lugha yako / Choose your language / Chagua lugha yako</p>
        <button onClick={() => handleLanguageSelect('en')} style={{padding: "15px 30px", margin: "10px", fontSize: "16px", cursor: "pointer"}}>English</button>
        <button onClick={() => handleLanguageSelect('sw')} style={{padding: "15px 30px", margin: "10px", fontSize: "16px", cursor: "pointer"}}>Kiswahili</button>
        <button onClick={() => handleLanguageSelect('sh')} style={{padding: "15px 30px", margin: "10px", fontSize: "16px", cursor: "pointer"}}>Sheng</button>
      </div>
    )
  }

  return (
    <div style={{padding: "20px", fontFamily: "Arial", maxWidth: "600px", margin: "auto"}}>
      <h1>MHFA Chatbot - {language === 'en'? 'English' : language === 'sw'? 'Kiswahili' : 'Sheng'}</h1>
      <div>
        <button onClick={() => setLanguage("")} style={{marginRight: "10px", fontSize: "12px", padding: "5px 10px"}}>Change Language</button>
        <button onClick={handleClear} style={{fontSize: "12px", padding: "5px 10px"}}>{langData[language].clearBtn}</button>
      </div>
      {alert && <div style={{background: "#d32f2f", color: "white", padding: "12px", borderRadius: "8px", margin: "10px 0"}}>{alert}</div>}
      <div style={{border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px", margin: "10px 0", borderRadius: "5px"}}>
        {messages.map((m, i) => <p key={i}><b>{m.sender}:</b> {m.text}</p>)}
        <div ref={chatEndRef} />
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        style={{width: "70%", padding: "8px"}}
        placeholder={langData[language].placeholder}
      />
      <button onClick={handleSend} style={{padding: "8px 15px", marginLeft: "5px"}}>
        {language === 'en'? 'Send' : 'Tuma'}
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Chatbot />)
