import React, { useEffect, useRef, useState } from "react";
import "./userSettings.css";
import language from "../../utils/language";
import { useAuthStore } from "../../context/useAuthStore";
import UserForm from "./form/UserForm";
import ModalWindow from "../ui/ModalWindow";
import { handleDownloadImage } from "../../utils/handleDownload";
import userService from "../../services/userService";
import PopUp from "../ui/PopUp";
import useAppStore from "../../context/useAppStore";
import DataComponent from "./DataMemory/DataComponent";
import { useSpring, a } from "@react-spring/web";
import UiSwitch from "../ui/Switch";
import Status from "../list/userInfo/status/Status";

const UserSettings = ({ close }) => {
  const userInfo = useAuthStore((state) => state.currentUser);
  const appState = useAppStore();
  const [changeAnim, setChangeAnim] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [dataMemory, setDataMemory] = useState(false);
  const [showImg, setShowImg] = useState(0);
  const [fullImg, setFullImg] = useState({
    img: null,
    state: false,
  });
  const ref = useRef(null);
  // const [lang, setLanguage]= useState('en');
  const [showPop, setShowPop] = useState(false);
  const [styles, api] = useSpring(() => ({
    from: { opacity: 0, y: -100 },
    // to: { opacity: 1, y: 0 },
  }));

  const [spring, api1] = useSpring(() => ({
    from: {
      y: -25,
      opacity: 0,
    },
    reset: true,
  }));

  const openAnims = () => {
    setChangeAnim((prev) => !prev);
    anims &&
      api1.start({
        y: changeAnim ? -25 : 0,
        opacity: changeAnim ? 0 : 1,
      });
  };

  const anims = userInfo.hasOwnProperty("settings")
    ? userInfo?.settings?.animations
    : true;

  const avatars = userInfo.hasOwnProperty("prevImgs")
    ? [userInfo.avatar, ...userInfo?.prevImgs]
    : [userInfo.avatar];

  const returnImage = async (e) => {
    e.stopPropagation();
    await userService.returnUserImage(
      avatars[showImg],
      userInfo.avatar,
      userInfo.id
    );
    console.log("meow");
  };

  const toggleAnims = async () => {
    await userService.toggleAnims(userInfo.id);
    console.log("anims status changed");
  };

  // Making links from supabase for downloanding and making download attr for Anchor element

  useEffect(() => {
    const getLinks = async () => {
      ref.current = await Promise.all(
        avatars.map((avatar) => handleDownloadImage(avatar))
      );
    };

    avatars.length >= 1 && getLinks();
  }, []);

  const nextImg = () => {
    if (showImg != avatars.length - 1) {
      setShowImg((prev) => prev + 1);
    } else {
      setShowImg(0);
    }
  };

  const prevImg = () => {
    if (showImg === 0) {
      setShowImg(avatars.length - 1);
    } else {
      setShowImg((prev) => prev - 1);
    }
  };

  if (changeData) {
    return <UserForm headBack={() => setChangeData(false)} />;
  }

  return (
    <div className="settings">
      <div className="tope">
        <div className="back">
          <svg
            onClick={() => close()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5"
            />
          </svg>
          <h2>{appState.appLanguage == "en" ? "Settings" : "Налаштування"}</h2>
        </div>
        <div className="action">
          <svg
            onClick={() => setChangeData((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </div>
      </div>
      <div className="main">
        <div className="settingsImg">
          <div className="slider">
            {avatars.length >= 2 && (
              <div className="lines">
                {avatars.map((el, index) => (
                  <div
                    key={el}
                    onClick={() => setShowImg(index)}
                    className={avatars[showImg] === el ? "chosen-line" : "line"}
                  ></div>
                ))}
              </div>
            )}
            {avatars.length >= 2 && (
              <svg
                onClick={() => prevImg()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="left"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
            )}
            {userInfo.prevImgs ? (
              <img
                onClick={() =>
                  setFullImg({
                    img: avatars[showImg],
                    state: true,
                  })
                }
                src={avatars[showImg]}
                alt="avatar"
              />
            ) : (
              <img
                onClick={() =>
                  setFullImg({
                    img: userInfo.avatar,
                    state: true,
                  })
                }
                src={userInfo.avatar || "./avatar.png"}
                alt="avatar"
              />
            )}
            {avatars.length >= 2 && (
              <svg
                onClick={() => nextImg()}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="right"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            )}
          </div>
          <h2>{userInfo.username}</h2>
        </div>
        <div className="settings-list">
          <div className="settings-list-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <div>
              <p>{userInfo.phoneNumber || "Add phone number"}</p>
              {userInfo.phoneNumber && (
                <span>
                  {language.settings.information[appState.appLanguage][0]}
                </span>
              )}
            </div>
          </div>
          <div className="settings-list-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
              />
            </svg>
            <div>
              <p>{"@" + userInfo.username}</p>
              <span>
                {language.settings.information[appState.appLanguage][1]}
              </span>
            </div>
          </div>
          <div className="settings-list-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
            <div>
              <p>{userInfo.about || "Nothing to say..."}</p>
              <span>
                {language.settings.information[appState.appLanguage][2]}
              </span>
            </div>
          </div>
          <div>
            <Status />
          </div>
        </div>
        <div className="settings-list2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <p>{language.settings.settingsList[appState.appLanguage][0]}</p>
          </div>
          <div className="anim">
            <div onClick={openAnims}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <p>{language.settings.settingsList[appState.appLanguage][1]}</p>
            </div>
            {changeAnim && (
              <a.div style={anims ? spring : {}}>
                {anims ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div>
                  <p>
                    {anims
                      ? language.settings.settingsList[appState.appLanguage][5]
                          .on
                      : language.settings.settingsList[appState.appLanguage][5]
                          .off}
                  </p>
                  <UiSwitch value={anims} handler={toggleAnims} />
                </div>
              </a.div>
            )}
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            <p>{language.settings.settingsList[appState.appLanguage][2]}</p>
          </div>
          <div
            onClick={() => {
              setDataMemory((prev) => !prev);
              api.start({ opacity: 1, y: 0 });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
              />
            </svg>
            <p>{language.settings.settingsList[appState.appLanguage][3]}</p>
          </div>
          <div className="language" onClick={() => setShowPop((prev) => !prev)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>
            <p>{language.settings.settingsList[appState.appLanguage][4]}</p>
            {showPop && (
              <PopUp
                changeStatePop={(data) => setShowPop(data)}
                changeLanguage={appState.changeLanguage}
              />
            )}
          </div>
        </div>
        {dataMemory && (
          <a.div style={styles}>
            <DataComponent headBack={() => setDataMemory(false)} />
          </a.div>
        )}
      </div>
      {fullImg.state && (
        <ModalWindow
          onclick={() => {
            setFullImg({
              img: null,
              state: false,
            });
          }}
        >
          <img
            style={{
              height: "80%",
              width: "80%",
            }}
            src={fullImg.img}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <div className="image-func">
            <svg
              onClick={returnImage}
              className="return-image"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <a
              href={ref?.current[showImg]}
              download="picture.png"
              className="download-image"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
          </div>
        </ModalWindow>
      )}
    </div>
  );
};

export default UserSettings;
