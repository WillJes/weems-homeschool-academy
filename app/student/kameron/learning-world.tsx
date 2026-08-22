"use client";
import { useEffect, useState } from "react";
import {Kameron90DayPlan} from "./agenda90";
import {KitMissions} from "./kit-missions";
import {KidReminders} from "./kid-reminders";
import {GameArcade} from "./game-arcade";
import {CareerLab} from "./career-lab";
import {FamilyDigitalLab} from "./family-digital-lab";
import {KameronQuarterRhythm} from "./quarter-rhythm";
const moods = [
  ["Ready", "☀️", "Let’s take on a challenge!"],
  ["Warm-up", "🌤️", "We’ll begin with an easy win."],
  ["Wiggly", "🌬️", "Let’s move before we learn."],
  ["Worried", "🌧️", "We can slow down together."],
];
type VoiceProfile = "dodger"|"hoot"|"larry"|"sam";
type DodgerVoiceStyle = "storybook"|"adventure"|"calm";
export default function Home({allowParentMode=false}:{allowParentMode?:boolean}) {
  const [mood, setMood] = useState("Ready"),
    [energy, setEnergy] = useState("Medium"),
    [step, setStep] = useState(0),
    [stars, setStars] = useState(0),
    [note, setNote] = useState(""),
    [parent, setParent] = useState(false),
    [readMode, setReadMode] = useState(false),
    [speaking, setSpeaking] = useState(false),
    [progress, setProgress] = useState<any>(null),
    [mathReflection, setMathReflection] = useState(""),
    [dodgerVoiceStyle,setDodgerVoiceStyle]=useState<DodgerVoiceStyle>("storybook");
  const record = async (
    eventType: string,
    skill: string,
    activity: string,
    result = "completed",
    minutes = 0,
  ) => {
    const event = { eventType, skill, activity, result, minutes, createdAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem("kameron-learning-events") || "[]");
      localStorage.setItem("kameron-learning-events", JSON.stringify([event, ...existing].slice(0, 200)));
    } catch {}
    return event;
  };
  const loadProgress = () => {
    try {
      const events = JSON.parse(localStorage.getItem("kameron-learning-events") || "[]");
      const today = new Date().toDateString();
      const todayEvents = events.filter((event: {createdAt: string}) => new Date(event.createdAt).toDateString() === today);
      const skills: Record<string, number> = {};
      for (const event of events) skills[event.skill] = (skills[event.skill] || 0) + 1;
      setProgress({events,todayEvents,weekMinutes:events.reduce((sum:number,event:{minutes:number})=>sum+(event.minutes||0),0),todayMinutes:todayEvents.reduce((sum:number,event:{minutes:number})=>sum+(event.minutes||0),0),skills});
    } catch { setProgress(null); }
  };
  const speak = (text: string, profile:VoiceProfile="dodger") => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voiceNamesByStyle:Record<DodgerVoiceStyle,string[]> = {
      storybook:["Eddy","Reed","Rocko","Arthur","Daniel","Aaron","Alex"],
      adventure:["Evan","James","Tom","David","Fred","Daniel"],
      calm:["Arthur","Gordon","Daniel","Aaron","Alex"],
    };
    const warmNames = [
      ...(profile==="dodger"?voiceNamesByStyle[dodgerVoiceStyle]:[]),
      "Daniel",
      "Arthur",
      "Gordon",
      "Fred",
      "James",
      "Aaron",
      "Evan",
      "Rishi",
      "Alex",
      "Tom",
      "David",
      "UK English Male",
    ];
    voice.voice =
      warmNames
        .map((name) => voices.find((v) => v.name.includes(name)))
        .find(Boolean) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;
    const dodgerStyles:Record<DodgerVoiceStyle,{rate:number;pitch:number}>={storybook:{rate:.9,pitch:.98},adventure:{rate:.98,pitch:1.04},calm:{rate:.82,pitch:.9}};
    const styles={dodger:dodgerStyles[dodgerVoiceStyle],hoot:{rate:.76,pitch:1.02},larry:{rate:1.02,pitch:1.18},sam:{rate:.72,pitch:.72}};
    voice.rate = styles[profile].rate;
    voice.pitch = styles[profile].pitch;
    voice.volume = 0.92;
    voice.onstart = () => setSpeaking(true);
    voice.onend = () => setSpeaking(false);
    voice.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(voice);
  };
  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };
  const readAnything=(e:React.MouseEvent<HTMLElement>)=>{if(!readMode)return;const target=e.target as HTMLElement;if(target.closest("button,input,textarea,select,a,label"))return;const block=target.closest("section,article") as HTMLElement|null;if(block)speak(block.innerText.slice(0,1600))};
  return (
    <main onClickCapture={readAnything}>
      <header>
        <b>🐾 Dodger Learning World</b>
        <DateTimeDisplay speak={speak}/>
        <div className="headerActions">
          <VoiceSetup speak={speak} voiceStyle={dodgerVoiceStyle} setVoiceStyle={setDodgerVoiceStyle}/>
          <button
            className={readMode ? "readToggle active" : "readToggle"}
            onClick={() => {
              setReadMode(!readMode);
              speak(
                !readMode
                  ? "Read to me mode is on. Tap or point to a learning section and I will read it."
                  : "Read to me mode is off.",
              );
            }}
            aria-pressed={readMode}
          >
            🔊 Read to Me {readMode ? "On" : "Off"}
          </button>
          <button onClick={stopReading} disabled={!speaking}>■ Stop</button>
          {allowParentMode && <button onClick={() => {setParent(true);loadProgress()}}>Parent Mode 🔒</button>}
        </div>
      </header>
      <DailyMissionDashboard speak={speak} record={record}/>
      <KidReminders speak={text=>speak(text)}/>
      <GameArcade speak={text=>speak(text)} record={record}/>
      <CareerLab speak={speak} record={record}/>
      <FamilyDigitalLab speak={speak} record={record}/>
      <KitMissions speak={speak} record={record}/>
      <KameronQuarterRhythm speak={speak}/>
      <Kameron90DayPlan speak={speak} record={record}/>
      <KameronLearningApps speak={speak}/>
      <BrickScannerLab speak={speak} record={record}/>
      <section
        className="hero readable"
        onMouseEnter={() =>
          readMode &&
          speak(
            "Hey Kameron! Ready to build something brilliant? I’m Dodger. We’ll learn in small steps, use our hands, and take a break whenever your learning engine needs one. No pressure. Trying, building, and asking for help all count as learning.",
          )
        }
        onClick={() =>
          readMode &&
          speak(
            "Hey Kameron! Ready to build something brilliant? I’m Dodger. We’ll learn in small steps, use our hands, and take a break whenever your learning engine needs one.",
          )
        }
      >
        <div>
          <small>TODAY’S LEARNING ADVENTURE</small>
          <h1>
            Hey, Kameron!
            <br />
            Ready to build something brilliant?
          </h1>
          <p>
            I’m Dodger. We’ll learn in small steps, use our hands, and take a
            break whenever your learning engine needs one.
          </p>
          <aside>
            ✓{" "}
            <span>
              <b>No pressure.</b> Trying, building, and asking for help all
              count as learning.
            </span>
          </aside>
        </div>
        <InteractiveDodger speak={speak} speaking={speaking} />
      </section>
      <DailyDodgerCoach speak={speak} record={record}/>
      <PersonalInfoPractice speak={speak} record={record}/>
      <MorningChecklist speak={speak} record={record} />
      <MorningMindset speak={speak} record={record} />
      <section
        className="check readable"
        onMouseEnter={() =>
          readMode &&
          speak(
            "Step one. Check your learning engine. There is no wrong answer. Pick what feels true right now: ready, warm-up, wiggly, or worried.",
          )
        }
      >
        <Title
          step="STEP 1"
          title="Check your learning engine"
          text="There’s no wrong answer. Pick what feels true right now."
        />
        <div className="moods">
          {moods.map((x) => (
            <button
              key={x[0]}
              className={mood === x[0] ? "chosen" : ""}
              onClick={() => setMood(x[0])}
            >
              <span>{x[1]}</span>
              <b>{x[0]}</b>
              <small>{x[2]}</small>
            </button>
          ))}
        </div>
        <div className="energy">
          <b>My energy is:</b>
          {["Low", "Medium", "High"].map((x) => (
            <button
              key={x}
              className={energy === x ? "chosen" : ""}
              onClick={() => setEnergy(x)}
            >
              {x}
            </button>
          ))}
          <span>
            <b>Dodger says:</b> {moods.find((x) => x[0] === mood)?.[2]}
          </span>
        </div>
      </section>
      <section
        className="mission readable"
        onMouseEnter={() =>
          readMode &&
          speak(
            "Step two. The ten brick challenge. Grab exactly ten building bricks. Count out ten bricks, build your idea, then tell Dodger what each part does.",
          )
        }
      >
        <div>
          <small>STEP 2 · BUILDING MISSION</small>
          <h2>The 10-Brick Challenge</h2>
          <p>
            Grab exactly ten building bricks. Build anything you imagine—but
            every brick needs a job.
          </p>
          <ol>
            <li>① Count out 10 bricks.</li>
            <li>② Build your idea.</li>
            <li>③ Tell Dodger what each part does.</li>
          </ol>
          <button
            onClick={() => {
              setStep(1);
              setTimeout(
                () => document.querySelector(".lesson")?.scrollIntoView(),
                20,
              );
            }}
          >
            Start my 10-brick mission →
          </button>
        </div>
        <div className="bricks">
          <b>10</b>
          <i />
          <em />
        </div>
      </section>
      <section
        className="lesson readable"
        onMouseEnter={() =>
          readMode &&
          speak(
            step === 0
              ? "Brick Builder Math. Your mission is waiting. Start when your bricks are ready."
              : step === 1
                ? "Build two equal rows. Use your ten bricks. Can you make two equal rows?"
                : step === 2
                  ? "How many bricks are in each row? Choose four, five, or six."
                  : step === 3
                    ? "You made an array! Two rows of five means two times five equals ten. Turn it around. What do you notice?"
                    : "Mission complete, Kameron! You counted, built equal groups, and explained your thinking. That is real math.",
          )
        }
      >
        <div className="lessonTitle">
          <div>
            <small>FIRST LESSON</small>
            <h2>Brick Builder Math</h2>
          </div>
          <div className="lessonTools">
            <button
              onClick={() =>
                speak(
                  step === 0
                    ? "Your mission is waiting. Start the challenge when your bricks are ready."
                    : step === 1
                      ? "Build two equal rows. Use your ten bricks. Can you make two equal rows?"
                      : step === 2
                        ? "How many bricks are in each row? Choose four, five, or six."
                        : step === 3
                          ? "You made an array. Two rows of five means two times five equals ten. Turn it around. What do you notice?"
                          : "Mission complete, Kameron! You counted, built equal groups, and explained your thinking.",
                )
              }
            >
              🔊 Hear this
            </button>
            <b>★ {stars} stars</b>
          </div>
        </div>
        <div className="progress">
          <i style={{ width: `${step * 25}%` }} />
        </div>
        {step === 0 && (
          <Card
            icon="🧱"
            title="Your mission is waiting"
            text="Start the challenge when your bricks are ready."
          />
        )}
        {step === 1 && (
          <Card
            icon="🧱"
            title="Build two equal rows"
            text="Use your 10 bricks. Can you make two equal rows?"
            action="I built it!"
            click={() => {
              setStep(2);
              setStars(1);
            }}
          />
        )}
        {step === 2 && (
          <div className="card">
            <span>🔢</span>
            <h3>How many bricks are in each row?</h3>
            <div className="answers">
              {[4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    n === 5
                      ? (setStep(3), setStars(2), setNote(""))
                      : setNote(
                          "Almost! Count one row slowly. Dodger will wait with you.",
                        )
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            {note && <p className="gentle">{note}</p>}
          </div>
        )}
        {step === 3 && (
          <div className="card reflectionCard">
            <span>💡</span>
            <h3>You made an array!</h3>
            <p>
              Two rows of five means 2 × 5 = 10. Turn it around. What do you
              notice?
            </p>
            <textarea
              value={mathReflection}
              onChange={(e) => setMathReflection(e.target.value)}
              placeholder="Type what you notice—or tap the microphone."
            />
            <SpeechToTextButton
              onText={(text) => setMathReflection(text)}
              speak={speak}
            />
            <button
              onClick={() => {
                record(
                  "reflection",
                  "Math reasoning",
                  "Array observation",
                  mathReflection || "spoken response",
                  3,
                );
                setStep(4);
                setStars(3);
              }}
            >
              Save what I noticed
            </button>
          </div>
        )}
        {step === 4 && (
          <Card
            icon="🏅"
            title="Mission complete, Kameron!"
            text="You counted, built equal groups, and explained your thinking. That is real math."
          />
        )}
      </section>
      <LearningGames speak={speak} record={record} />
      <HistoryScienceClub speak={speak} record={record} />
      <KameronSubjectRecaps speak={speak} record={record}/>
      <KameronVideoLibrary speak={speak}/>
      <section className="interests">
        <Title
          step="BUILT FOR KAMERON"
          title="Learn through what you love"
          text="Dodger uses your favorite things to make hard skills feel familiar."
        />
        <div className="interestGrid">
          <article>
            <span>🧱</span>
            <h3>LEGO Word Builder</h3>
            <p>
              Build one brick for every sound, then arrange the sounds to spell
              the word.
            </p>
            <b>Spelling · Memory · Confidence</b>
          </article>
          <article>
            <span>🏎️</span>
            <h3>Hot Wheels Math Track</h3>
            <p>
              Race cars through addition, subtraction, skip-counting, and story
              problems.
            </p>
            <b>Math · Memorizing · Focus</b>
          </article>
          <article>
            <span>🎨</span>
            <h3>Draw the Story</h3>
            <p>
              Draw the beginning, middle, and end before turning the pictures
              into sentences.
            </p>
            <b>Writing · Spelling · Ideas</b>
          </article>
        </div>
      </section>
      <section className="next">
        <Title
          step="KAMERON'S SKILL GARAGE"
          title="What Dodger will help strengthen"
          text="Short practice, hands-on choices, repeat-without-shame, and lots of real wins."
        />
        <div className="skillChips">
          <span>🔤 Spelling</span>
          <span>➕ Math</span>
          <span>🧠 Memory</span>
          <span>✏️ Writing</span>
          <span>⭐ Confidence</span>
        </div>
        <div className="paths">
          <Path
            icon="📖"
            type="MIACADEMY"
            title="Word Builder"
            time="15 minutes"
          />
          <Path
            icon="🏎️"
            type="HANDS-ON MATH"
            title="Number Raceway"
            time="10 minutes"
          />
          <Path
            icon="🎨"
            type="CREATIVE WRITING"
            title="Draw, then write"
            time="10 minutes"
          />
        </div>
      </section>
      <footer>
        Built for Kameron with patience, purpose, and room to move.{" "}
        <b>One 30-minute mission at a time.</b>
      </footer>
      {speaking && (
        <button className="stopReading" onClick={stopReading}>
          ■ Stop reading
        </button>
      )}
      {parent && (
        <div className="shade" onClick={() => setParent(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setParent(false)}>
              ×
            </button>
            <small>PARENT MODE</small>
            <h2>Jestina’s dashboard</h2>
            <div className="dashboard">
                <p>
                  <b>Today’s readiness</b>
                  <span>
                    {mood} · {energy} energy
                  </span>
                </p>
                <p>
                  <b>Lesson status</b>
                  <span>{step === 4 ? "Mission complete" : "In progress"}</span>
                </p>
                <p>
                  <b>Evidence</b>
                  <span>{stars}/3 skills demonstrated</span>
                </p>
                <p>
                  <b>Priority skills</b>
                  <span>Spelling · Math · Memory · Writing · Confidence</span>
                </p>
                <p>
                  <b>Best learning hooks</b>
                  <span>LEGO · Hot Wheels · Drawing</span>
                </p>
                <p>
                  <b>Recommended next</b>
                  <span>Miacademy Word Builder · 15 min</span>
                </p>
                <div className="savedSummary">
                  <h3>Saved Progress</h3>
                  {!progress ? (
                    <span>Loading Kameron’s records…</span>
                  ) : (
                    <>
                      <p>
                        <b>Today’s instructional time</b>
                        <span>{progress.todayMinutes} minutes</span>
                      </p>
                      <p>
                        <b>This week</b>
                        <span>
                          {progress.weekMinutes} minutes ·{" "}
                          {progress.events.length} activities
                        </span>
                      </p>
                      <div className="skillTotals">
                        {Object.entries(progress.skills || {}).map(
                          ([skill, count]) => (
                            <span key={skill}>
                              {skill}: {String(count)}
                            </span>
                          ),
                        )}
                      </div>
                      <h4>Recent learning</h4>
                      {progress.events.slice(0, 5).map((event: any) => (
                        <p key={event.id}>
                          <b>{event.activity}</b>
                          <span>
                            {event.skill} · {event.result}
                          </span>
                        </p>
                      ))}
                    </>
                  )}
                </div>
                <button className="unlock" onClick={() => setParent(false)}>
                  Close Parent Mode
                </button>
                <small>
                  Progress is saved privately and used for daily and weekly
                  summaries.
                </small>
              </div>
          </div>
        </div>
      )}
    </main>
  );
}
function Title({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="title">
      <small>{step}</small>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
function Card({
  icon,
  title,
  text,
  action,
  click,
}: {
  icon: string;
  title: string;
  text: string;
  action?: string;
  click?: () => void;
}) {
  return (
    <div className="card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && <button onClick={click}>{action}</button>}
    </div>
  );
}
function Path({
  icon,
  type,
  title,
  time,
}: {
  icon: string;
  type: string;
  title: string;
  time: string;
}) {
  return (
    <article>
      {icon}
      <small>{type}</small>
      <h3>{title}</h3>
      <p>{time}</p>
    </article>
  );
}

function VoiceSetup({speak,voiceStyle,setVoiceStyle}:{speak:(text:string)=>void;voiceStyle:DodgerVoiceStyle;setVoiceStyle:(x:DodgerVoiceStyle)=>void}){const [open,setOpen]=useState(false),[listening,setListening]=useState(false),[heard,setHeard]=useState(""),[status,setStatus]=useState("Not tested yet");const testMic=()=>{const w=window as any,R=w.SpeechRecognition||w.webkitSpeechRecognition;if(!window.isSecureContext){setStatus("Microphone needs a secure browser window. Typing still works.");return}if(!R){setStatus("Talk-to-text is not supported by this browser. Use Chrome or type the answer.");return}try{const r=new R();r.lang="en-US";r.interimResults=false;r.onstart=()=>{setListening(true);setStatus("Listening… say: Hello Dodger")};r.onresult=(e:any)=>{const t=e.results[0][0].transcript;setHeard(t);setStatus("Microphone is working!")};r.onerror=(e:any)=>{setStatus(e.error==="not-allowed"?"Microphone permission is blocked. Ask a grown-up to allow it in the browser.":"I could not hear that. Try again or type instead.")};r.onend=()=>setListening(false);r.start()}catch{setStatus("The microphone could not start. Typing still works.")}};const choose=(style:DodgerVoiceStyle)=>{setVoiceStyle(style);setTimeout(()=>speak(style==="storybook"?"Welcome, builder! Every great adventure begins with one bright idea.":style==="adventure"?"Adventure paws ready! Let’s build, test, and discover!":"Take your time, buddy. We can learn one peaceful step at a time."),30)};return <><button className="voiceSetupButton" onClick={()=>setOpen(true)}>🎤 Voice & Character</button>{open&&<div className="voiceSetupBackdrop" onMouseDown={()=>setOpen(false)}><section className="voiceSetupPanel" onMouseDown={e=>e.stopPropagation()}><button className="voiceClose" onClick={()=>setOpen(false)}>×</button><small>DODGER VOICE STUDIO</small><h2>Choose Dodger’s storybook voice.</h2><div className="voiceStyles">{([['storybook','📖','Storybook'],['adventure','🚀','Adventure'],['calm','🌙','Calm Coach']] as const).map(x=><button className={voiceStyle===x[0]?"selected":""} key={x[0]} onClick={()=>choose(x[0])}><span>{x[1]}</span><b>{x[2]}</b><small>Tap to hear</small></button>)}</div><div className="voiceTests"><article><span>🔊</span><div><h3>Can you hear Dodger?</h3><p>The available character voice depends on this device. Chrome usually offers the best selection.</p><button onClick={()=>speak("Hey Kameron! Dodger is here. Let’s turn your big idea into a brilliant build!")}>Test selected voice</button></div></article><article><span>🎤</span><div><h3>Can Dodger hear you?</h3><p>Tap the test, allow microphone access, and say “Hello Dodger.”</p><button className={listening?"listening":""} onClick={testMic}>{listening?"Listening…":"Test my microphone"}</button></div></article></div><p className="voiceStatus"><b>Status:</b> {status}</p>{heard&&<p className="voiceHeard">Dodger heard: “{heard}”</p>}<aside><b>Good to know:</b><p>This version uses the voices already installed on the device. A studio-recorded or licensed AI character voice can be connected later for the same sound on every device.</p></aside></section></div>}</>}
function InteractiveDodger({ speak,speaking }: { speak: (text: string) => void;speaking:boolean }) {
  const [pose, setPose] = useState<"enter" | "awake" | "nap" | "build">(
    "enter",
  );
  const [motionKey,setMotionKey]=useState(0);
  const [frame,setFrame]=useState(0);
  const [fullAnimation,setFullAnimation]=useState(true);
  const poseFrames={enter:["/dodger/s3-f5.png","/dodger/s3-f0.png","/dodger/s3-f5.png"],awake:["/dodger/s2-f0.png","/dodger/s2-f2.png","/dodger/s2-f5.png"],nap:["/dodger/s2-f0.png"],build:["/dodger/s1-f2.png","/dodger/s2-f2.png"]};
  const talkFrames=["/dodger/s3-f3.png","/dodger/s3-f4.png","/dodger/s3-f5.png","/dodger/s2-f0.png"];
  useEffect(()=>{setFrame(0);if(!fullAnimation)return;const frames=speaking?talkFrames:poseFrames[pose];const timer=setInterval(()=>setFrame(x=>(x+1)%frames.length),speaking?230:pose==="nap"?1500:pose==="enter"?420:700);return()=>clearInterval(timer)},[pose,speaking,fullAnimation]);
  const messages = {
    enter: "I’m here, Kameron! Let’s make today count!",
    awake: "I’m awake and ready, buddy!",
    nap: "Just resting my learning paws…",
    build: "Hmm… this piece needs a job!",
  };
  const change = (next: typeof pose) => {
    setPose(next);
    setMotionKey(value=>value+1);
    speak(messages[next]);
    if(next==="enter") setTimeout(()=>{setPose("awake");setMotionKey(value=>value+1)},2600);
  };
  return (
    <div className="dog interactiveDog">
      <i>{messages[pose]}</i>
      <button className={fullAnimation?"animationMode active":"animationMode"} onClick={()=>{const next=!fullAnimation;setFullAnimation(next);setMotionKey(value=>value+1);speak(next?"Full animation mode is on! I’m ready to move, talk, build, and play!":"Animation mode is paused.")}} aria-pressed={fullAnimation}>{fullAnimation?"✨ Full Animation: ON":"▶ Turn Full Animation On"}</button>
      <div key={motionKey} className={`dogScene ${pose} ${speaking?"isSpeaking":"isIdle"} ${fullAnimation?"fullAnimation":"motionPaused"}`}>
        {pose==="enter"&&<div className="pawTrail">🐾　🐾　🐾</div>}
        <button className="dodgerCharacter" onClick={()=>{setFrame(0);speak(messages[pose])}} aria-label={`Dodger is ${pose}. Tap Dodger to hear him.`}><span className="dodgerShadow"/><img src={(speaking?talkFrames:poseFrames[pose])[frame]} alt={`Dodger ${speaking?"speaking":pose}`}/><span className="tapSpark">✨</span>{speaking&&<span className="soundWaves">)))</span>}</button>
        {pose === "nap" && <b className="zzz">Zzz</b>}
        {pose === "build" && (
          <div className="miniBuild">
            🟥🟨
            <br />
            🟦🟩🟧
          </div>
        )}
      </div>
      <b>Dodger</b>
      <small>Wise guide · Builder’s best friend</small>
      <div className="dodgerControls">
        <button onClick={() => change("enter")}>🐾 Enter the world</button>
        <button onClick={() => change("awake")}>☀️ Wake up</button>
        <button onClick={() => change("nap")}>💤 Take a nap</button>
        <button onClick={() => change("build")}>🧱 Work on a build</button>
      </div>
    </div>
  );
}

function DodgerAvatar({mood="happy",label="Dodger"}:{mood?:"happy"|"thinking"|"listening"|"proud";label?:string}){const src={happy:"/dodger/s2-f0.png",thinking:"/dodger/s1-f2.png",listening:"/dodger/s3-f0.png",proud:"/dodger/s3-f5.png"}[mood];return <img className="dodgerAvatar" src={src} alt={`${label} is ${mood}`}/>}

const kamApps=[
 {icon:"📚",name:"Hooked on Phonics",skill:"Reading, phonics, spelling, and word practice",url:"https://subscriptions.hookedonphonics.com/app-on-boarding/login",color:"coral"},
 {icon:"🐭",name:"ABCmouse",skill:"Learning games, books, math, science, art, and music",url:"https://www.abcmouse.com/abc/login/",color:"yellow"},
 {icon:"🌊",name:"Miacademy",skill:"K–8 lessons, practice, games, and electives",url:"https://miacademy.co/login",color:"teal"},
 {icon:"🧱",name:"Brickit",skill:"Scan loose bricks, count pieces, and find builds using what you have",url:"https://brickit.app/",color:"brick"},
];
function KameronLearningApps({speak}:{speak:(x:string)=>void}){return <section className="kamApps"><div><small>MY LEARNING APPS</small><h2>Choose an app and keep learning</h2><p>Dodger will stay right here. The learning app opens in a new tab.</p></div><div className="kamAppGrid">{kamApps.map(x=><article className={x.color} key={x.name}><span>{x.icon}</span><h3>{x.name}</h3><p>{x.skill}</p><div><button onClick={()=>speak(`${x.name}. ${x.skill}. Ask a grown-up for help signing in if you need it.`)}>🔊 Hear about it</button><a href={x.url} target="_blank" rel="noreferrer">Open {x.name} ↗</a></div></article>)}</div><small className="loginPrivacy">🔒 Dodger Learning World does not ask for or save passwords.</small></section>}

function BrickScannerLab({speak,record}:{speak:(x:string)=>void;record:(a:string,b:string,c:string,d?:string,e?:number)=>unknown}){const [steps,setSteps]=useState([false,false,false,false]),[idea,setIdea]=useState(""),[message,setMessage]=useState("");const labels=["Spread the bricks into one flat layer","Ask a grown-up to open Brickit and take the scan","Choose a suggested build and follow the steps","Change one part and explain my new design"];const toggle=(i:number)=>setSteps(x=>x.map((v,n)=>n===i?!v:v));const finish=()=>{const count=steps.filter(Boolean).length;if(count<3){setMessage("Complete at least three builder steps first. Dodger knows you can do it!");speak("Complete at least three builder steps first. Take your time, builder.");return}const result=idea.trim()||"Completed a Brickit build";setMessage("Build recorded! You practiced counting, planning, problem-solving, and creativity.");record("hands-on lab","Engineering & math",result,"completed",25);speak("Build recorded! You used counting, planning, problem solving, and creativity. That is master builder work!")};return <section className="brickScannerLab readable"><div className="brickLabIntro"><small>🧱 BRICK SCANNER BUILD LAB</small><h2>See it. Count it. Build it. Change it.</h2><p>Use Brickit with a grown-up to scan loose bricks and discover what can be built from the pieces already at home.</p><div className="brickSkillTags"><span>Counting</span><span>Engineering</span><span>Following directions</span><span>Creative changes</span></div></div><div className="brickLabCard"><ol>{labels.map((label,i)=><li key={label}><button className={steps[i]?"done":""} onClick={()=>toggle(i)} aria-pressed={steps[i]}>{steps[i]?"✓":"○"}</button><span><b>Step {i+1}</b>{label}</span></li>)}</ol><label>What did you build or change?<input value={idea} onChange={e=>setIdea(e.target.value)} placeholder="I built a car and changed…"/></label><div className="brickLabActions"><button onClick={()=>speak("Spread the bricks in one flat layer. Ask a grown-up to scan them in Brickit. Choose a build, follow the steps, then change one part and explain your new design.")}>🔊 Hear the steps</button><a href="https://brickit.app/" target="_blank" rel="noreferrer">Open Brickit with a grown-up ↗</a><button onClick={finish}>⭐ Record my build</button></div>{message&&<p className="brickLabMessage">🐾 {message}</p>}</div></section>}

const dailyMissions=[
 {id:"coach",icon:"☀️",title:"Morning with Dodger",detail:"Power-Ups, affirmation, goal, and learning-engine check",minutes:10},
 {id:"games",icon:"🧱",title:"Reading or Math Game",detail:"Choose LEGO Word Builder or Hot Wheels Math Race",minutes:15},
 {id:"club",icon:"🦉",title:"Discovery Mission",detail:"Learn with Hoot, Larry, or Sam",minutes:15},
];
function DailyMissionDashboard({speak,record}:{speak:(text:string)=>void;record:(a:string,b:string,c:string,d?:string,e?:number)=>unknown}){
 const[done,setDone]=useState<boolean[]>([false,false,false]),[finished,setFinished]=useState(false);
 useEffect(()=>{try{const data=JSON.parse(localStorage.getItem("dodger-daily-missions")||"null");if(data?.date===new Date().toDateString())setDone(data.done)}catch{}},[]);
 const toggle=(i:number)=>{const next=done.map((x,n)=>n===i?!x:x);setDone(next);localStorage.setItem("dodger-daily-missions",JSON.stringify({date:new Date().toDateString(),done:next}));if(next[i]){record("daily mission","Learning plan",dailyMissions[i].title,"completed",dailyMissions[i].minutes);speak(`${dailyMissions[i].title} complete. Strong work, Kameron!`)}};
 const finish=()=>{const total=done.filter(Boolean).length;setFinished(true);record("daily summary","Learning plan","Finished for Today",`${total} of 3 missions`,0);speak(`You finished ${total} of your three missions today, Kameron. I’m proud of your effort. Every step counts!`)};
 return <section className="dailyDashboard"><div className="dashboardIntro"><div><small>TODAY’S SIMPLE PLAN</small><h2>Three missions. One step at a time.</h2><p>Choose a card to jump to that learning area. Check it off when you finish.</p></div><div className="missionRing"><b>{done.filter(Boolean).length}/3</b><span>missions</span></div></div><div className="dailyMissionGrid">{dailyMissions.map((m,i)=><article key={m.id} className={done[i]?"complete":""}><span>{m.icon}</span><small>MISSION {i+1} · {m.minutes} MIN</small><h3>{m.title}</h3><p>{m.detail}</p><div><button onClick={()=>document.querySelector(`.${m.id}`)?.scrollIntoView({behavior:"smooth"})}>Go to mission</button><button onClick={()=>toggle(i)}>{done[i]?"✓ Complete":"Mark complete"}</button></div></article>)}</div><button className="finishToday" onClick={finish}>🏁 Finished for Today</button>{finished&&<div className="dailySummary"><span>⭐</span><h3>Today’s Summary</h3><p>Kameron completed {done.filter(Boolean).length} of 3 focused missions. Effort, self-direction, and every completed step were recorded in Parent Mode.</p></div>}</section>
}

function DateTimeDisplay({speak}:{speak:(text:string)=>void}){
 const[now,setNow]=useState<Date|null>(null);useEffect(()=>{setNow(new Date());const timer=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(timer)},[]);
 if(!now)return <div className="dateTime" aria-label="Loading date and time">📅 Loading…</div>;
 const date=now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});const time=now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
 return <button className="dateTime" onClick={()=>speak(`Today is ${date}. The time is ${time}.`)}><span>📅 {date}</span><b>🕐 {time}</b><small>Tap to hear</small></button>
}

function PersonalInfoPractice({speak,record}:{speak:(text:string)=>void;record:(a:string,b:string,c:string,d?:string,e?:number)=>unknown}){
 const[name,setName]=useState(""),[address,setAddress]=useState(""),[message,setMessage]=useState("");const target="KAMERON";
 const checkName=()=>{const clean=name.replace(/\s/g,"").toUpperCase();if(clean===target){setMessage("You spelled Kameron correctly! Great job!");speak("You spelled Kameron correctly! K, A, M, E, R, O, N. Great job!");record("practice","Spelling & life skills","Spelled first name","correct",3)}else{setMessage("Good try. Look at the model and compare one letter at a time.");speak("Good try. Let’s spell it together. K, A, M, E, R, O, N.")}};
 const practiceAddress=()=>{if(!address.trim()){setMessage("Ask your grown-up to help enter the address for this practice.");return}setMessage("Nice work practicing your address! This address will not be saved.");speak(`Nice work practicing your address. Let’s say it slowly together. ${address}`);record("practice","Life skills","Practiced home address","completed",4)};
 return <section className="personalPractice"><Title step="MY IMPORTANT INFORMATION" title="Practice my name and address" text="Knowing how to spell your name and say your address is an important life skill."/><div className="personalGrid"><article><span>✏️</span><small>SPELL MY NAME</small><div className="nameModel">K A M E R O N</div><button onClick={()=>speak("Kameron. K, A, M, E, R, O, N.")}>🔊 Hear the spelling</button><input value={name} onChange={e=>setName(e.target.value)} placeholder="Type KAMERON" autoComplete="off"/><SpeechToTextButton onText={setName} speak={speak}/><button onClick={checkName}>Check my name</button></article><article><span>🏠</span><small>PRACTICE MY ADDRESS</small><p>Ask a grown-up to help. Type or say the address, practice it, then refresh or close the page to clear it.</p><textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter the address only when a grown-up is helping" autoComplete="off"/><SpeechToTextButton onText={setAddress} speak={speak}/><button onClick={practiceAddress}>Practice saying it</button><b className="privacyNote">🔒 The address is not saved in progress reports.</b></article></div>{message&&<div className="personalMessage">🐕 Dodger says: {message}</div>}</section>
}

const coachTasks=["Make your bed","Brush your teeth","Take a shower","Eat breakfast"];
function DailyDodgerCoach({speak,record}:{speak:(text:string,profile?:VoiceProfile)=>void;record:(a:string,b:string,c:string,d?:string,e?:number)=>unknown}){
 const[stage,setStage]=useState<"welcome"|"power"|"affirm"|"goal"|"engine"|"support"|"launch"|"done">("welcome"),[task,setTask]=useState(0),[reply,setReply]=useState(""),[goal,setGoal]=useState(""),[coachMood,setCoachMood]=useState(""),[started,setStarted]=useState(false),[firstDay,setFirstDay]=useState(false);
 useEffect(()=>{const returning=localStorage.getItem("dodger-met-kameron")==="yes";setFirstDay(!returning);localStorage.setItem("dodger-met-kameron","yes")},[]);
 const say=(text:string)=>{setReply(text);speak(text)};
 const start=()=>{setStarted(true);setStage("welcome");say(firstDay?"Good morning, Kameron! I’m Dodger, your learning buddy. Ready to build something brilliant today?":"Good morning, Kameron! Ready to build something brilliant today? Let’s check in and do your Morning Power-Ups.")};
 const nextWelcome=()=>{setStage("power");say(`First Power-Up: Did you ${coachTasks[0].toLowerCase()}?`)};
 const taskAnswer=(yes:boolean)=>{if(yes)record("routine","Life skills",coachTasks[task],"confirmed",2);const next=task+1;if(next<coachTasks.length){setTask(next);say(`${yes?"Excellent work!":"That’s okay—we can take care of it next."} Did you ${coachTasks[next].toLowerCase()}?`)}else{setStage("affirm");say("Morning Power-Ups checked! Now repeat after me: I am smart, creative, and ready to learn.")}};
 const afterAffirm=()=>{setStage("goal");say("I like hearing you speak life over yourself. Kameron, what do you want to accomplish today?")};
 const acceptGoal=(text:string)=>{if(!text.trim())return;setGoal(text);record("objective","Self-direction",text,"Kameron's guided objective",2);say(`That is a strong goal. ${text}. We will break it into small steps, and every step counts. How does your learning engine feel right now?`);setStage("engine")};
 const selectMood=(value:string)=>{setCoachMood(value);record("check-in","Learning readiness",value,"Kameron's check-in",1);setStage("support");if(value==="Ready")say("Wonderful. Your engine is ready, so let’s begin!");if(value==="Warm-up")say("A warm-up is a smart choice. We’ll start with one easy win before the bigger challenge.");if(value==="Wiggly")say("Let’s get those wiggles moving! Stand up, shake your hands, march ten steps, and take one slow breath.");if(value==="Worried")say("Thank you for telling me. What is making you worried? You can talk or type, and we’ll think of something that may help.")};
 const supportResponse=(text:string)=>{if(coachMood==="Worried"&&text.trim()){record("check-in","Emotional learning readiness","Worry shared",text,2);say(`I hear you, Kameron. ${text}. You are not alone with that worry. Let’s take a slow breath, ask a grown-up for help if we need it, and begin with something small that you enjoy.`)}else say("Great reset. Your body and brain are getting ready.");setStage("launch")};
 const launch=()=>{say("I know how much you love bricks and Hot Wheels. We can use bricks for spelling or math, and Hot Wheels for math and science. Math can feel challenging, but objects and dots make numbers easier to see. Don’t forget to use the dots provided. You’ve got this!");setStage("done")};
 return <section className="coach"><Title step="TALK WITH DODGER" title="Kameron’s Guided Morning" text="Dodger asks one question, waits for Kameron, responds, and moves forward together."/>{!started?<button className="startCoach" onClick={start}>🐾 Start my morning with Dodger</button>:<div className="coachRoom"><div className="coachDodger"><DodgerAvatar mood={stage==="goal"||stage==="support"?"listening":stage==="done"?"proud":"happy"}/><b>Dodger</b><i>{reply}</i><button onClick={()=>speak(reply)}>🔊 Hear Dodger again</button></div><div className="coachResponse">{stage==="welcome"&&<><h3>Are you ready?</h3><button onClick={nextWelcome}>Yes, let’s go!</button></>}{stage==="power"&&<><h3>{coachTasks[task]}</h3><div><button onClick={()=>taskAnswer(true)}>✓ Yes, I did</button><button onClick={()=>taskAnswer(false)}>Not yet</button></div></>}{stage==="affirm"&&<><h3>“I am smart, creative, and ready to learn.”</h3><button onClick={afterAffirm}>I said it!</button></>}{stage==="goal"&&<OpenResponse value={goal} setValue={setGoal} submit={()=>acceptGoal(goal)} label="My goal today" speak={speak}/>} {stage==="engine"&&<><h3>How does your learning engine feel?</h3><div className="engineChoices">{["Ready","Warm-up","Wiggly","Worried"].map(x=><button key={x} onClick={()=>selectMood(x)}>{x}</button>)}</div></>}{stage==="support"&&<OpenResponse value="" setValue={()=>{}} submit={()=>supportResponse("")} label={coachMood==="Worried"?"Tell Dodger what is worrying you":"Tell Dodger when your reset is complete"} speak={speak} onSubmitText={supportResponse}/>} {stage==="launch"&&<button onClick={launch}>I’m ready for bricks, cars, and learning!</button>}{stage==="done"&&<div className="coachDone"><span>⭐</span><h3>Morning conversation complete!</h3><p>Today’s goal: {goal}</p></div>}</div></div>}</section>
}

function OpenResponse({value,setValue,submit,label,speak,onSubmitText}:{value:string;setValue:(x:string)=>void;submit:()=>void;label:string;speak:(text:string,profile?:VoiceProfile)=>void;onSubmitText?:(x:string)=>void}){
 const[local,setLocal]=useState(value);const update=(x:string)=>{setLocal(x);setValue(x)};const go=()=>onSubmitText?onSubmitText(local):submit();
 return <div className="openResponse"><h3>{label}</h3><textarea value={local} onChange={e=>update(e.target.value)} placeholder="Type or use the microphone…"/><SpeechToTextButton onText={text=>{update(text);if(onSubmitText)setTimeout(()=>onSubmitText(text),250)}} speak={text=>speak(text)}/><button onClick={go}>Send to Dodger</button></div>
}

function SpeechToTextButton({
  onText,
  speak,
}: {
  onText: (text: string) => void;
  speak: (text: string) => void;
}) {
  const [listening, setListening] = useState(false),
    [supported, setSupported] = useState(true),
    [micMessage,setMicMessage]=useState("");
  const listen = async () => {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      speak(
        "This device does not offer talk to text here. You can still type your answer.",
      );
      return;
    }
    if(!window.isSecureContext){setSupported(false);setMicMessage("The microphone needs a secure browser window. Typing still works.");return}
    try{
      if(navigator.mediaDevices?.getUserMedia){const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(track=>track.stop())}
    }catch{setMicMessage("Microphone permission is blocked. Tap the lock icon near the web address, allow Microphone, then try again.");speak("The microphone is blocked. Ask a grown-up to allow microphone access in the browser.");return}
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous=false;
    recognition.onstart = () => {setListening(true);setMicMessage("Listening now—say one short answer.")};
    recognition.onend = () => {setListening(false);setMicMessage(x=>x.startsWith("I heard")?x:"Listening stopped. Tap again to retry or type your answer.")};
    recognition.onerror = (event:any) => {
      setListening(false);
      const blocked=event?.error==="not-allowed"||event?.error==="service-not-allowed";
      setMicMessage(blocked?"Microphone access is blocked. Allow it in browser settings, then retry.":"I didn’t catch that. Try again, speak clearly, or type your answer.");
      speak(
        "I did not catch that. You can try the microphone again or type your answer.",
      );
    };
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onText(text);
      setMicMessage(`I heard: “${text}”`);
      speak(`I heard: ${text}`);
    };
    recognition.start();
  };
  return (
    <div className="talkToText">
      <button
        type="button"
        className={listening ? "listening" : ""}
        onClick={listen}
      >
        {listening ? "🎙️ Listening…" : "🎤 Talk instead of type"}
      </button>
      {!supported && (
        <small>
          Talk-to-text is unavailable on this device. Typing still works.
        </small>
      )}
      {supported&&micMessage&&<small className="micStatus" role="status">{micMessage}</small>}
    </div>
  );
}

const affirmations = [
  "I am smart, creative, and ready to learn.",
  "Mistakes help my brain grow stronger.",
  "I can take my time and still do great work.",
  "My ideas matter, and my voice deserves to be heard.",
];
function MorningMindset({
  speak,
  record,
}: {
  speak: (text: string) => void;
  record: (a: string, b: string, c: string, d?: string, e?: number) => unknown;
}) {
  const [affirmation, setAffirmation] = useState(affirmations[0]);
  const [objective, setObjective] = useState("");
  const [saved, setSaved] = useState(false);
  const [dodgerReply,setDodgerReply]=useState("");
  const respondToGoal=(goal:string)=>{const reply=`That’s a strong goal, Kameron. ${goal}. We’ll take it one step at a time, and I’ll be right here with you.`;setDodgerReply(reply);speak(reply)};
  const newAffirmation = () => {
    const next =
      affirmations[
        (affirmations.indexOf(affirmation) + 1) % affirmations.length
      ];
    setAffirmation(next);
    speak(`Repeat after Dodger. ${next}`);
  };
  const saveObjective = () => {
    const clean = objective.trim();
    if (!clean) return;
    record(
      "objective",
      "Self-direction",
      clean,
      "Kameron's daily objective",
      2,
    );
    localStorage.setItem(
      "dodger-daily-objective",
      JSON.stringify({ date: new Date().toDateString(), objective: clean }),
    );
    setSaved(true);
    respondToGoal(clean);
  };
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("dodger-daily-objective") || "null",
      );
      if (data?.date === new Date().toDateString()) {
        setObjective(data.objective);
        setSaved(true);
      }
    } catch {}
  }, []);
  return (
    <section className="mindset">
      <Title
        step="KAMERON + DODGER"
        title="Morning Mindset"
        text="Speak something good over yourself, then choose your own goal for today."
      />
      <div className="mindsetGrid">
        <article className="affirmation">
          <span>☀️</span>
          <small>MORNING AFFIRMATION</small>
          <blockquote>“{affirmation}”</blockquote>
          <div>
            <button
              onClick={() => speak(`Repeat after Dodger. ${affirmation}`)}
            >
              🔊 Say it with Dodger
            </button>
            <button onClick={newAffirmation}>✨ New affirmation</button>
          </div>
        </article>
        <article className="objective">
          <span>🎯</span>
          <small>MY OBJECTIVE TODAY</small>
          <h3>What do you want to accomplish?</h3>
          <textarea
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value);
              setSaved(false);
            }}
            placeholder="Today I want to…"
            maxLength={180}
          />
          <SpeechToTextButton
            onText={(text) => {
              setObjective(text);
              setSaved(false);
              respondToGoal(text);
            }}
            speak={speak}
          />
          <button onClick={saveObjective}>Save my objective</button>
          {saved && (
            <p>
              ✓ You chose this goal yourself. Dodger believes you can do it!
            </p>
          )}
          {dodgerReply&&<div className="objectiveReply"><DodgerAvatar mood="proud"/><p><b>Dodger says:</b> {dodgerReply}</p><button onClick={()=>speak(dodgerReply)}>🔊 Hear again</button></div>}
        </article>
      </div>
    </section>
  );
}

const clubActivities = {
  history: {
    guide: "Hoot",
    icon: "🦉",
    title: "Hoot’s History Time Machine",
    lessonTitle: "Why Rivers Helped Communities Grow",
    lesson: "Long ago, many communities began beside rivers. Rivers gave people fresh water to drink, water for crops, fish for food, and a way to move people and supplies. When rivers flooded, they could also leave rich soil behind for farming. Living near a river helped a community survive and grow, although people also had to prepare for floods.",
    facts: ["Fresh water", "Rich farm soil", "Food and transportation"],
    question: "Why did people build communities near rivers?",
    choices: [
      "Water and fertile land",
      "To avoid all plants",
      "Because roads were illegal",
    ],
    answer: 0,
    mission:
      "Draw a river community. Add homes, food, transportation, and one problem the river helped solve.",
    video:"https://www.youtube.com/watch?v=BlrI_nb96X8",
    videoTitle:"3rd Grade Social Studies Review",
  },
  science: {
    guide: "Larry",
    icon: "🐿️",
    title: "Larry’s Seed Lab",
    lessonTitle: "How a Seed Wakes Up",
    lesson: "A seed may look quiet, but a tiny plant is waiting inside. When a seed receives water, it softens and begins germination. A root usually grows downward first to find more water. Then a shoot grows upward toward light. The seed uses stored food until its first leaves can make energy from sunlight.",
    facts: ["Water starts germination", "Roots grow downward", "Shoots grow toward light"],
    question: "What does a seed need first to begin growing?",
    choices: ["Water", "A television", "Paint"],
    answer: 0,
    mission:
      "Place one dry bean in a damp paper towel. Observe and draw it for five days.",
    video:"https://www.youtube.com/watch?v=yzERkBasAf4",
    videoTitle:"3rd Grade Science Review",
  },
  nature: {
    guide: "Sam",
    icon: "🐻",
    title: "Sam’s Habitat Builder",
    lessonTitle: "What Makes a Habitat a Home",
    lesson: "A habitat is the place where an animal lives. A healthy habitat supplies food for energy, water to drink, shelter from weather and danger, and enough space to move. Different animals need different habitats. A bear may use a forest and den, while a fish needs clean water with oxygen.",
    facts: ["Food for energy", "Water to drink", "Shelter and safe space"],
    question: "Which three things does every animal habitat need?",
    choices: [
      "Food, water, shelter",
      "Toys, music, candy",
      "Cars, roads, stores",
    ],
    answer: 0,
    mission:
      "Use blocks or draw a safe habitat for an animal. Label its food, water, and shelter.",
    video:"https://www.youtube.com/watch?v=CZhE2p46vJk",
    videoTitle:"Food Chains and Habitats",
  },
};
const clubExtras={
 history:[
  {guide:"Hoot",icon:"🦉",title:"Hoot’s Democracy Detective",lessonTitle:"Why Communities Make Laws",lesson:"Communities create laws to help people stay safe, solve problems, and understand what is expected. Good citizens learn the rules, ask questions, and help improve their communities. Laws can change when people identify unfairness and work together.",facts:["Laws help organize communities","Citizens have rights and responsibilities","Rules can change"],question:"Why do communities create laws?",choices:["To help people live safely and fairly","To stop all questions","To make every day identical"],answer:0,mission:"Create one fair rule for a classroom or home. Draw what happens when people follow it.",video:"https://www.youtube.com/watch?v=438cUd7qb54",videoTitle:"Laws, Civil Rights, and Sources"},
  {guide:"Hoot",icon:"🦉",title:"Hoot’s Past-and-Present Lab",lessonTitle:"How Historians Study Change",lesson:"Historians compare objects, pictures, maps, letters, and stories from different times. These are sources. A source gives clues, but one source may not tell the whole story, so historians compare several clues.",facts:["Sources are clues","Dates help build timelines","Compare more than one source"],question:"What should a historian do with one old photograph?",choices:["Compare it with other sources","Guess everything from it","Throw it away"],answer:0,mission:"Choose an old and new object. Draw or list three ways life changed and one way it stayed the same.",video:"https://www.youtube.com/watch?v=sSnSYIYYVgI",videoTitle:"Long Ago and Today"}
 ],
 science:[
  {guide:"Larry",icon:"🐿️",title:"Larry’s Matter Lab",lessonTitle:"Materials Have Properties",lesson:"Everything around us is made of matter. Materials can be hard or soft, rough or smooth, bendy or stiff, waterproof or absorbent. Scientists observe these properties to decide which material fits a job.",facts:["Matter takes up space","Properties can be observed","Materials fit different jobs"],question:"Which property matters most for a raincoat?",choices:["Waterproof","Tasty","Very heavy"],answer:0,mission:"Test three safe materials with a few drops of water. Record which absorb water and which repel it.",video:"https://www.youtube.com/watch?v=TwXq9bLlZEM",videoTitle:"Materials and Their Properties"},
  {guide:"Larry",icon:"🐿️",title:"Larry’s Living Things Lab",lessonTitle:"What Makes Something Alive",lesson:"Living things need energy, grow, respond to their surroundings, and reproduce. Plants and animals are living, but rocks and toys are not. Scientists use several clues together instead of only checking whether something moves.",facts:["Living things grow","They need energy","They respond to surroundings"],question:"Which is a living thing?",choices:["A growing plant","A toy car","A rock"],answer:0,mission:"Find or draw two living and two nonliving things. Label the clues that helped you decide.",video:"https://www.youtube.com/watch?v=Gy60BqCnTG4",videoTitle:"What Makes Something Alive?"}
 ],
 nature:[
  {guide:"Sam",icon:"🐻",title:"Sam’s Food-Chain Builder",lessonTitle:"Energy Moves Through a Food Chain",lesson:"Plants use sunlight to make food. Some animals eat plants, and other animals eat those animals. Arrows in a food chain show how energy moves from one living thing to another.",facts:["Energy begins with sunlight","Plants are producers","Arrows show energy movement"],question:"Where does most food-chain energy begin?",choices:["The Sun","A television","A shoe"],answer:0,mission:"Draw the Sun, a plant, a plant-eater, and a predator. Add arrows to show energy moving.",video:"https://www.youtube.com/watch?v=CZhE2p46vJk",videoTitle:"Food Chains"},
  {guide:"Sam",icon:"🐻",title:"Sam’s Structure Challenge",lessonTitle:"Natural and Human-Made Structures",lesson:"A natural structure forms in nature, like a tree, shell, or spiderweb. A human-made structure is designed and built by people, like a bridge, house, or tower. Both kinds of structures have shapes that help them stay strong.",facts:["Nature builds structures","People design structures","Shape affects strength"],question:"Which is a human-made structure?",choices:["A bridge","A spiderweb","A seashell"],answer:0,mission:"Build a small bridge with blocks or paper. Test it with toy cars and improve one weak part.",video:"https://www.youtube.com/watch?v=BTnqtYBUaNU",videoTitle:"Natural and Human-Made Structures"}
 ]
};
const clubTopicSets={history:[clubActivities.history,...clubExtras.history],science:[clubActivities.science,...clubExtras.science],nature:[clubActivities.nature,...clubExtras.nature]};
function HistoryScienceClub({
  speak,
  record,
}: {
  speak: (text: string, profile?:VoiceProfile) => void;
  record: (a: string, b: string, c: string, d?: string, e?: number) => unknown;
}) {
  const [key, setKey] = useState<keyof typeof clubActivities>("history"),
    [topicIndexes,setTopicIndexes]=useState<Record<keyof typeof clubActivities,number>>(()=>{const day=Math.floor(Date.now()/86400000);return{history:day%3,science:(day+1)%3,nature:(day+2)%3}}),
    [message, setMessage] = useState(
      "Choose an answer, then try the hands-on mission.",
    ),
    [observation, setObservation] = useState(""),
    [lessonReady, setLessonReady] = useState(false);
  const a = clubTopicSets[key][topicIndexes[key]];
  const nextTopic=()=>{const next=(topicIndexes[key]+1)%clubTopicSets[key].length;setTopicIndexes(x=>({...x,[key]:next}));setLessonReady(false);setObservation("");setMessage("A fresh lesson is ready!");localStorage.setItem(`dodger-${key}-topic`,String(next));speak(`${a.guide} has a new ${key} lesson ready for you!`,key==="history"?"hoot":key==="science"?"larry":"sam")};
  const guideVoice:VoiceProfile=key==="history"?"hoot":key==="science"?"larry":"sam";
  const choose = (index: number) => {
    if (index === a.answer) {
      setMessage(`${a.guide} says: Correct! Now try the mission.`);
      speak(key==="history"?`Wise thinking, young historian! ${a.mission}`:key==="science"?`Yes! Great discovery, Kameron! ${a.mission}`:`Strong work, explorer. ${a.mission}`,guideVoice);
      record(
        "club activity",
        key === "history" ? "History" : "Science",
        a.title,
        "correct",
        10,
      );
      setTimeout(nextTopic,2200);
    } else {
      setMessage(
        `${a.guide} says: Good thinking. Look for what living things or communities truly need.`,
      );
      speak(key==="history"?"Let’s pause and think carefully about what people needed in that time.":key==="science"?"Ooh, good experiment! Let’s inspect those choices one more time!":"No rush. Think about what keeps an animal safe and healthy.",guideVoice);
      record(
        "club activity",
        key === "history" ? "History" : "Science",
        a.title,
        "retry",
        2,
      );
    }
  };
  return (
    <section className="club">
      <Title
        step="DODGER & FRIENDS"
        title="History and Science Club"
        text="Travel through time, investigate nature, and build discoveries with Dodger’s animal friends."
      />
      <div className="topicRefresh"><span>🔄 Lessons change automatically each day and after a correct answer.</span><button onClick={nextTopic}>Show me a different lesson</button></div>
      <div className="friendTabs">
        {Object.entries(clubActivities).map(([id, item]) => (
          <button
            key={id}
            className={key === id ? "active" : ""}
            onClick={() => {
              setKey(id as keyof typeof clubActivities);
              setMessage("Choose an answer, then try the hands-on mission.");
              setObservation("");
              setLessonReady(false);
              const profile:VoiceProfile=id==="history"?"hoot":id==="science"?"larry":"sam";speak(id==="history"?`Greetings, young historian. Welcome to ${item.title}. Let’s study the clues of the past.`:id==="science"?`Hey, discovery buddy! Welcome to ${item.title}. Let’s investigate!`:`Welcome, explorer. You’re safe with me in ${item.title}. Let’s learn together.`,profile);
            }}
          >
            <span>{item.icon}</span>
            <b>{item.guide}</b>
            <small>
              {id === "history"
                ? "History"
                : id === "science"
                  ? "Plant Science"
                  : "Animal Science"}
            </small>
          </button>
        ))}
      </div>
      <div className="clubActivity">
        <div className="guideCard">
          <span>{a.icon}</span>
          <h3>{a.title}</h3>
          <p>{a.guide} is your guide today.</p>
          <button
            onClick={() => speak(`${a.lessonTitle}. ${a.lesson}`,guideVoice)}
          >
            🔊 Hear mini-lesson
          </button>
        </div>
        <div className="clubLesson">
          <small>STEP 1 · LEARN WITH {a.guide.toUpperCase()}</small>
          <div className="miniLesson"><h3>{a.lessonTitle}</h3><p>{a.lesson}</p><div className="lessonFacts">{a.facts.map(fact=><span key={fact}>✓ {fact}</span>)}</div><button onClick={()=>{setLessonReady(true);speak(key==="history"?"Excellent listening. Now use the clues from our lesson.":key==="science"?"Awesome listening! Now let’s test your discovery brain!":"You listened carefully. Now take your time with one question.",guideVoice)}}>{lessonReady?"✓ Lesson covered":"I’m ready for the question"}</button></div>
          <div className="friendVideo"><span>▶️</span><div><small>WATCH WITH {a.guide.toUpperCase()}</small><b>{a.videoTitle}</b><p>After the video, tell {a.guide} one new fact you learned.</p></div><a href={a.video} target="_blank" rel="noreferrer">Watch lesson ↗</a></div>
          {lessonReady && <div className="questionAfterLesson"><small>STEP 2 · THINK LIKE AN EXPLORER</small><h3>{a.question}</h3>
          <div className="clubChoices">
            {a.choices.map((choice, index) => (
              <button key={choice} onClick={() => choose(index)}>
                {choice}
              </button>
            ))}
          </div>
          <p className="clubMessage">{message}</p>
          </div>}
          {lessonReady && <div className="handsOn">
            <b>STEP 3 · 🧭 Hands-on mission</b>
            <p>{a.mission}</p>
            <label>Tell {a.guide} what you noticed</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Type or talk about your discovery…"
            />
            <SpeechToTextButton onText={setObservation} speak={speak} />
            <button
              onClick={() => {
                if (!observation.trim()) return;
                speak(key==="history"?"Your observation connects us to the past. Well done, Kameron.":key==="science"?"That is a fantastic observation! Scientists notice details just like you did!":"I like how carefully you observed that. Strong and steady work.",guideVoice);
                record(
                  "observation",
                  key === "history" ? "History" : "Science",
                  a.title,
                  observation,
                  5,
                );
              }}
            >
              Save my observation
            </button>
          </div>}
        </div>
      </div>
    </section>
  );
}

const kamSubjects=[
 {icon:"📖",name:"Reading & Phonics",prompt:"What word, sound, story, or reading skill did you practice?"},{icon:"✏️",name:"Spelling & Writing",prompt:"What word did you spell or what sentence did you write?"},{icon:"🔢",name:"Math",prompt:"What problem did you solve? Tell which dots, blocks, shapes, or strategy helped."},{icon:"🔬",name:"Science",prompt:"What did you observe, test, build, or discover?"},{icon:"🌎",name:"History & Social Studies",prompt:"Who, what, when, or where did you learn about?"},{icon:"🤖",name:"Robotics & Coding",prompt:"What did you build, program, fix, or make move?"},{icon:"🎹",name:"Music & Piano",prompt:"What note, rhythm, song, or music skill did you practice?"},{icon:"🥋",name:"Karate & Movement",prompt:"What move or habit helped your body grow stronger?"},{icon:"🇪🇸",name:"Spanish",prompt:"What Spanish word, phrase, number, or greeting did you learn?"},{icon:"🎨",name:"Art & Drawing",prompt:"What did you create, and what is your favorite detail?"},{icon:"🧯",name:"Safety & Life Skills",prompt:"What safety rule or independent skill did you practice?"},{icon:"💛",name:"Feelings & Confidence",prompt:"What was challenging, and what helped you keep trying?"},
];
function KameronSubjectRecaps({speak,record}:{speak:(x:string)=>void;record:(a:string,b:string,c:string,d?:string,e?:number)=>unknown}){const [selected,setSelected]=useState(0),[text,setText]=useState("");const s=kamSubjects[selected];useEffect(()=>{setText(localStorage.getItem(`kam-recap-${s.name}`)||"")},[s.name]);const save=()=>{if(!text.trim())return;localStorage.setItem(`kam-recap-${s.name}`,text);record("subject recap",s.name,"Lesson remembered",text,5);speak(`Great remembering, Kameron! You explained your ${s.name} learning in your own words.`)};return <section className="kamRecaps"><Title step="KAMERON’S RECAP STUDIO" title="Tell Dodger what you learned" text="Choose a subject. Talk, type, draw it on paper, or build it with bricks—then save the memory."/><div className="kamRecapLayout"><div className="kamSubjectGrid">{kamSubjects.map((x,i)=><button className={selected===i?"active":""} key={x.name} onClick={()=>setSelected(i)}><span>{x.icon}</span><b>{x.name}</b><small>"Choose"</small></button>)}</div><article className="kamRecapCard"><span>{s.icon}</span><small>MY {s.name.toUpperCase()} RECAP</small><h3>{s.prompt}</h3><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Tell it in your own words…"/><SpeechToTextButton onText={setText} speak={speak}/><div><button onClick={()=>speak(s.prompt)}>🔊 Hear the question</button><button onClick={save}>⭐ Save my recap</button></div><aside><b>More ways to remember:</b><p>Draw a picture • Build a model • Act it out • Teach it to someone</p></aside></article></div></section>}

const kamVideos=[
 ["Reading","Syllables with Scratch Garden","https://www.youtube.com/watch?v=9S7DY2lgJlU","Clap and count the syllables in five words."],["Reading","Top 100 Sight Words","https://www.youtube.com/watch?v=ppopXrxQPU8","Write or say five words you recognized."],["Math","Counting by Twos","https://www.youtube.com/watch?v=GvTcpfSnOMQ","Use bricks or dots to make groups of two."],["Math","Counting by Fives","https://www.youtube.com/watch?v=EemjeA2Djjw","Count five toy cars, then ten, fifteen, and twenty."],["Science","3rd Grade Science Compilation","https://www.youtube.com/watch?v=yzERkBasAf4","Choose one part and draw a new fact."],["Science","Food Chains","https://www.youtube.com/watch?v=CZhE2p46vJk","Draw arrows showing who eats what."],["History","3rd Grade Social Studies","https://www.youtube.com/watch?v=BlrI_nb96X8","Tell Hoot one fact about a person, place, or rule."],["History","U.S. History for Kids","https://www.youtube.com/watch?v=KxqHQ1ZNbc4","Write one question you still have."],["Life Skills","Friendship — PBS KIDS","https://www.youtube.com/watch?v=nS35EuJswOs","Name one way to be a good friend."],["Civics","Symbols of Democracy — PBS KIDS","https://www.youtube.com/watch?v=I7YSWQ3Tqds","Find or draw one symbol you saw."],
];
function KameronVideoLibrary({speak}:{speak:(x:string)=>void}){const [filter,setFilter]=useState("All"),cats=["All",...Array.from(new Set(kamVideos.map(x=>x[0])))];return <section className="kamLibrary"><Title step="DODGER’S VIDEO LIBRARY" title="Watch, pause, and show what you know" text="Every video has one small mission. A grown-up can help open YouTube and return here afterward."/><div className="kamFilters">{cats.map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="kamVideoGrid">{kamVideos.filter(x=>filter==="All"||x[0]===filter).map(x=><article key={x[2]}><div>▶️</div><small>{x[0]}</small><h3>{x[1]}</h3><p><b>After-video mission:</b> {x[3]}</p><button onClick={()=>speak(`${x[1]}. After the video, ${x[3]}`)}>🔊 Hear mission</button><a href={x[2]} target="_blank" rel="noreferrer">Watch with a grown-up ↗</a></article>)}</div><p className="videoSafety">🛡️ YouTube can show ads or recommended videos. Use these selected lesson links with normal grown-up supervision.</p></section>}

const morningTasks = [
  { name: "Make my bed", icon: "🛏️" },
  { name: "Brush my teeth", icon: "🪥" },
  { name: "Take a shower", icon: "🚿" },
  { name: "Eat breakfast", icon: "🥣" },
];

function MorningChecklist({
  speak,
  record,
}: {
  speak: (text: string) => void;
  record: (a: string, b: string, c: string, d?: string, e?: number) => unknown;
}) {
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  useEffect(() => {
    const saved = localStorage.getItem("dodger-morning-checklist");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.date === new Date().toDateString() && Array.isArray(data.done))
        setDone(data.done);
    } catch {
      /* start fresh */
    }
  }, []);
  const toggle = (index: number) => {
    const next = done.map((value, i) => (i === index ? !value : value));
    setDone(next);
    localStorage.setItem(
      "dodger-morning-checklist",
      JSON.stringify({ date: new Date().toDateString(), done: next }),
    );
    if (next[index])
      record(
        "routine",
        "Life skills",
        morningTasks[index].name,
        "completed",
        2,
      );
    if (next.every(Boolean))
      speak(
        "Morning Power-Up complete! Great job, Kameron. Your body and your learning engine are ready!",
      );
    else if (next[index])
      speak(`${morningTasks[index].name} complete. Nice job!`);
  };
  const complete = done.filter(Boolean).length;
  return (
    <section className="morning">
      <div className="morningTop">
        <div>
          <small>BEFORE WE LEARN</small>
          <h2>Morning Power-Up</h2>
          <p>
            Take care of yourself first. Then we’re ready for today’s adventure.
          </p>
        </div>
        <div
          className={complete === 4 ? "morningScore complete" : "morningScore"}
        >
          <b>{complete}/4</b>
          <span>
            {complete === 4 ? "Power-Up complete!" : "Ready-up tasks"}
          </span>
        </div>
      </div>
      <div className="morningList">
        {morningTasks.map((task, index) => (
          <button
            key={task.name}
            className={done[index] ? "morningTask done" : "morningTask"}
            onClick={() => toggle(index)}
            aria-pressed={done[index]}
          >
            <span>{task.icon}</span>
            <b>{task.name}</b>
            <i>{done[index] ? "✓ Done" : "Tap when done"}</i>
          </button>
        ))}
      </div>
      {complete === 4 && (
        <div className="morningCelebrate">
          ⭐ Amazing job, Kameron! You took care of your space and your body.
          Let’s learn!
        </div>
      )}
    </section>
  );
}

const wordRounds = [
  {
    clue: "A world that travels around a star",
    answer: "PLANET",
    chunks: ["PLA", "NET", "CAR"],
  },
  { clue: "Full of light", answer: "BRIGHT", chunks: ["BR", "IGHT", "ING"] },
  {
    clue: "A vehicle that travels on tracks",
    answer: "TRAIN",
    chunks: ["TR", "AIN", "OWN"],
  },
];
const mathRounds = [
  {
    question: "7 + 8",
    answer: 15,
    choices: [14, 15, 16],
    kind: "add",
    groups: [7, 8],
    visualHelp: "Count both groups of dots.",
  },
  {
    question: "24 − 9",
    answer: 15,
    choices: [13, 15, 17],
    kind: "subtract",
    groups: [24, 9],
    visualHelp: "Start with 24 blocks. The crossed-out blocks are taken away.",
  },
  {
    question: "4 × 3",
    answer: 12,
    choices: [7, 12, 16],
    kind: "multiply",
    groups: [3, 3, 3, 3],
    visualHelp: "Count 4 equal groups of 3 shapes.",
  },
  {
    question: "18 ÷ 3",
    answer: 6,
    choices: [5, 6, 9],
    kind: "divide",
    groups: [6, 6, 6],
    visualHelp: "18 dots are shared into 3 equal groups. Count one group.",
  },
];

function LearningGames({
  speak,
  record,
}: {
  speak: (text: string) => void;
  record: (a: string, b: string, c: string, d?: string, e?: number) => unknown;
}) {
  const [wordRound, setWordRound] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [wordMessage, setWordMessage] = useState("Build the word in order.");
  const [mathRound, setMathRound] = useState(0);
  const [mathMessage, setMathMessage] = useState("Solve it to move your car!");
  const word = wordRounds[wordRound];
  const math = mathRounds[mathRound];
  const chooseChunk = (chunk: string) => {
    const next = [...built, chunk];
    setBuilt(next);
    const attempt = next.join("");
    if (!word.answer.startsWith(attempt)) {
      record("game", "Spelling", "LEGO Word Builder", "retry", 1);
      setBuilt([]);
      setWordMessage(
        "Good try! Those bricks do not fit yet. Listen to the sounds and try again.",
      );
      speak(
        "Good try. Those bricks do not fit yet. Listen to the sounds and try again.",
      );
    } else if (attempt === word.answer) {
      record("game", "Reading & spelling", "LEGO Word Builder", "correct", 5);
      setWordMessage(`You built ${word.answer}! Great reading!`);
      speak(`You built ${word.answer}! Great reading, Kameron!`);
      setTimeout(() => {
        setWordRound((wordRound + 1) % wordRounds.length);
        setBuilt([]);
        setWordMessage("Build the next word in order.");
      }, 1200);
    }
  };
  const chooseMath = (choice: number) => {
    if (choice === math.answer) {
      record("game", "Math", "Hot Wheels Math Race", "correct", 3);
      setMathMessage("Correct! Your car zoomed forward!");
      speak("Correct! Your car zoomed forward!");
      setTimeout(() => {
        setMathRound((mathRound + 1) % mathRounds.length);
        setMathMessage("Solve it to move your car!");
      }, 900);
    } else {
      record("game", "Math", "Hot Wheels Math Race", "retry", 1);
      setMathMessage("Almost! Try a different answer. The race is still on!");
      speak("Almost! Try a different answer. The race is still on!");
    }
  };
  return (
    <section className="games">
      <Title
        step="DODGER'S GAME GARAGE"
        title="Play, learn, and level up"
        text="Every game practices a real school skill—and there is always another try."
      />
      <div className="gameGrid">
        <article className="game wordGame">
          <div className="gameLabel">
            <span>🧱</span>
            <b>READING + SPELLING</b>
          </div>
          <h3>LEGO Word Builder</h3>
          <button
            className="hearClue"
            onClick={() => speak(`Your clue is: ${word.clue}`)}
          >
            🔊 Hear the clue
          </button>
          <p className="clue">{word.clue}</p>
          <div className="wordBuild" aria-label="word being built">
            {built.length ? (
              built.map((x, i) => <span key={i}>{x}</span>)
            ) : (
              <i>Place word bricks here</i>
            )}
          </div>
          <div className="chunkChoices">
            {word.chunks.map((x) => (
              <button key={x} onClick={() => chooseChunk(x)}>
                {x}
              </button>
            ))}
          </div>
          <p className="gameMessage">{wordMessage}</p>
        </article>
        <article className="game mathGame">
          <div className="gameLabel">
            <span>🏎️</span>
            <b>MATH + MEMORY</b>
          </div>
          <h3>Hot Wheels Math Race</h3>
          <div className="track">
            <span style={{ left: `${12 + mathRound * 22}%` }}>🏎️</span>
            <b>🏁</b>
          </div>
          <button
            className="hearClue"
            onClick={() =>
              speak(
                `What is ${math.question.replace("×", "times").replace("÷", "divided by")}?`,
              )
            }
          >
            🔊 Hear the problem
          </button>
          <p className="equation">{math.question} = ?</p>
          <MathVisual round={math} speak={speak} />
          <div className="mathChoices">
            {math.choices.map((x) => (
              <button key={x} onClick={() => chooseMath(x)}>
                {x}
              </button>
            ))}
          </div>
          <p className="gameMessage">{mathMessage}</p>
        </article>
      </div>
    </section>
  );
}

function MathVisual({
  round,
  speak,
}: {
  round: (typeof mathRounds)[number];
  speak: (text: string) => void;
}) {
  const dots = (count: number, crossed = 0) => (
    <div className="visualDots">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} className={i >= count - crossed ? "crossed" : ""} />
      ))}
    </div>
  );
  return (
    <div className={`mathVisual ${round.kind}`} aria-label={round.visualHelp}>
      <div className="visualTop">
        <b>👀 See the math</b>
        <button onClick={() => speak(round.visualHelp)}>
          🔊 Hear visual help
        </button>
      </div>
      {round.kind === "add" && (
        <div className="visualGroups">
          <div>
            {dots(round.groups[0])}
            <small>7 dots</small>
          </div>
          <strong>+</strong>
          <div>
            {dots(round.groups[1])}
            <small>8 dots</small>
          </div>
        </div>
      )}
      {round.kind === "subtract" && (
        <div className="visualGroups single">
          <div>
            {dots(round.groups[0], round.groups[1])}
            <small>24 blocks with 9 crossed out</small>
          </div>
        </div>
      )}
      {round.kind === "multiply" && (
        <div className="visualGroups equal">
          {round.groups.map((count, index) => (
            <div key={index}>
              {dots(count)}
              <small>group {index + 1}</small>
            </div>
          ))}
        </div>
      )}
      {round.kind === "divide" && (
        <div className="visualGroups equal divide">
          {round.groups.map((count, index) => (
            <div key={index}>
              {dots(count)}
              <small>equal group {index + 1}</small>
            </div>
          ))}
        </div>
      )}
      <p>{round.visualHelp}</p>
    </div>
  );
}
