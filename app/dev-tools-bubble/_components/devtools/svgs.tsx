import React from "react";
import Svg, {
  Path,
  Line,
  Rect,
  LinearGradient,
  Stop,
  Circle,
  Defs,
  Mask,
  G,
  Ellipse,
} from "react-native-svg";

export function Search() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path
        d="M13 13L9 9m1.333-3.333a4.667 4.667 0 11-9.333 0 4.667 4.667 0 019.333 0z"
        stroke="#667085"
      />
    </Svg>
  );
}

export function Trash() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 3h6M3 6h18m-2 0l-.701 10.52c-.105 1.578-.158 2.367-.499 2.965a3 3 0 01-1.298 1.215c-.62.3-1.41.3-2.993.3h-3.018c-1.582 0-2.373 0-2.993-.3A3 3 0 016.2 19.485c-.34-.598-.394-1.387-.499-2.966L5 6m5 4.5v5m4-5v5"
        stroke="#667085"
      />
    </Svg>
  );
}

export function ChevronDown() {
  return (
    <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
      <Path d="M1 1l4 4 4-4" stroke="#667085" />
    </Svg>
  );
}

export function ArrowUp() {
  return (
    <Svg width={12} height={12} viewBox="0 0 16 16" fill="none">
      <Path d="M8 13.333V2.667m0 0l-4 4m4-4l4 4" stroke="#667085" />
    </Svg>
  );
}

export function ArrowDown() {
  return (
    <Svg width={12} height={12} viewBox="0 0 16 16" fill="none">
      <Path d="M8 2.667v10.666m0 0l-4-4m4 4l4-4" stroke="#667085" />
    </Svg>
  );
}

export function ArrowLeft() {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: "rotate(90deg)",
      }}
    >
      <Path d="M8 2.667v10.666m0 0l-4-4m4 4l4-4" stroke="#667085" />
    </Svg>
  );
}

export function ArrowRight() {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: "rotate(-90deg)",
      }}
    >
      <Path d="M8 2.667v10.666m0 0l-4-4m4 4l4-4" stroke="#667085" />
    </Svg>
  );
}

export function Sun() {
  return (
    <Svg viewBox="0 0 24 24" height={12} width={12} fill="none">
      <Path
        d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69L4.9 19.104m12.786-1.414l1.414 1.414M22 12h-2m-3 0a5 5 0 11-10 0 5 5 0 0110 0z"
        stroke="#667085"
      />
    </Svg>
  );
}

export function Moon() {
  return (
    <Svg viewBox="0 0 24 24" height={12} width={12} fill="none">
      <Path
        d="M22 15.844a10.424 10.424 0 01-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 002 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156z"
        stroke="#667085"
      />
    </Svg>
  );
}

export function Monitor() {
  return (
    <Svg viewBox="0 0 24 24" height={12} width={12} fill="none">
      <Path
        d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C4.28 17 5.12 17 6.8 17z"
        stroke="#667085"
      />
    </Svg>
  );
}

export function Wifi() {
  return (
    <Svg
      stroke="#667085"
      fill="currentColor"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
    >
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </Svg>
  );
}

export function Offline() {
  return (
    <Svg strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
      <Path
        fill="none"
        d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"
      ></Path>
      <Path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z"></Path>
    </Svg>
  );
}

export function Settings() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function Copier() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#667085"
      />
    </Svg>
  );
}

export function CopiedCopier(props: { theme: "light" | "dark" }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
        stroke={props.theme === "dark" ? "#12B76A" : "#027A48"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ErrorCopier() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
        stroke="#F04438"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function List() {
  return (
    <Svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#667085"
      strokeWidth="2"
    >
      <Rect width="20" height="20" y="2" x="2" rx="2" />
      <Line y1="7" y2="7" x1="6" x2="18" />
      <Line y2="12" y1="12" x1="6" x2="18" />
      <Line y1="17" y2="17" x1="6" x2="18" />
    </Svg>
  );
}

export function Check(props: { checked: boolean; theme: "light" | "dark" }) {
  return (
    <>
      {props.checked ? (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
            stroke={props.theme === "dark" ? "#9B8AFB" : "#6938EF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg viewBox="0 0 24 24" height="20" width="20" fill="none">
          <Path
            d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"
            stroke={props.theme === "dark" ? "#9B8AFB" : "#6938EF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></Path>
        </Svg>
      )}
    </>
  );
}

export function CheckCircle() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#027A48"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LoadingCircle() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
        stroke="#B54708"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function XCircle() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#b91c1c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PauseCircle() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#5925DC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
export function TanstackLogo() {
  return (
    <Svg
      height="100%"
      width="100%"
      style={{
        position: "absolute",
      }}
      viewBox="0 0 633 633"
    >
      <LinearGradient
        x1={-666.45}
        x2={-666.45}
        y1={163.28}
        y2={163.99}
        gradientTransform="matrix(633 0 0 633 422177 -103358)"
        gradientUnits="userSpaceOnUse"
        id="a"
      >
        <Stop stopColor="#6BDAFF" offset={0} />
        <Stop stopColor="#F9FFB5" offset={0.32} />
        <Stop stopColor="#FFA770" offset={0.71} />
        <Stop stopColor="#FF7373" offset={1} />
      </LinearGradient>
      <Circle cx={316.5} cy={316.5} r={316.5} fill="url(#a)" />
      <Defs></Defs>
      <Mask
        x={-137.5}
        y={412}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="c"
      >
        <G filter="url(#b)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#c)">
        <Ellipse
          cx={89.5}
          cy={610.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#00CFE2"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={316.5}
        y={412}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="e"
      >
        <G filter="url(#d)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#e)">
        <Ellipse
          cx={543.5}
          cy={610.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#00CFE2"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={-137.5}
        y={450}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="g"
      >
        <G filter="url(#f)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#g)">
        <Ellipse
          cx={89.5}
          cy={648.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#00A8B8"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={316.5}
        y={450}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="i"
      >
        <G filter="url(#h)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#i)">
        <Ellipse
          cx={543.5}
          cy={648.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#00A8B8"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={-137.5}
        y={486}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="k"
      >
        <G filter="url(#j)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#k)">
        <Ellipse
          cx={89.5}
          cy={684.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#007782"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={316.5}
        y={486}
        width={454}
        height={396.9}
        maskUnits="userSpaceOnUse"
        id="m"
      >
        <G filter="url(#l)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#m)">
        <Ellipse
          cx={543.5}
          cy={684.5}
          rx={214.5}
          ry={186}
          fill="#015064"
          stroke="#007782"
          strokeWidth={25}
        />
      </G>
      <Defs></Defs>
      <Mask
        x={272.2}
        y={308}
        width={176.9}
        height={129.3}
        maskUnits="userSpaceOnUse"
        id="o"
      >
        <G filter="url(#n)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#o)">
        <Path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={11}
          d="M436 403.2L431 431.8"
        />
        <Path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={11}
          d="M291 341.5L280 403.5"
        />
        <Path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={11}
          d="M332.9 384.1L328.6 411.2"
        />
        <LinearGradient
          x1={-670.75}
          x2={-671.59}
          y1={164.4}
          y2={164.49}
          gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"
          gradientUnits="userSpaceOnUse"
          id="p"
        >
          <Stop stopColor="#EE2700" offset={0} />
          <Stop stopColor="#FF008E" offset={1} />
        </LinearGradient>
        <Path
          d="M344.1 363l97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"
          clipRule="evenodd"
          fillRule="evenodd"
          fill="url(#p)"
        />
        <Path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={7}
          d="M428.2 384.5L429.1 378"
        />
        <Path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={7}
          d="M395.2 379.5L396.1 373"
        />
        <Path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={7}
          d="M362.2 373.5L363.1 367.4"
        />
        <Path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={7}
          d="M324.2 351.3L328.4 347.4"
        />
        <Path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={7}
          d="M303.2 331.3L307.4 327.4"
        />
      </G>
      <Defs></Defs>
      <Mask
        x={73.2}
        y={113.8}
        width={280.6}
        height={317.4}
        maskUnits="userSpaceOnUse"
        id="r"
      >
        <G filter="url(#q)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#r)">
        <LinearGradient
          x1={-672.16}
          x2={-672.16}
          y1={165.03}
          y2={166.03}
          gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"
          gradientUnits="userSpaceOnUse"
          id="s"
        >
          <Stop stopColor="#A17500" offset={0} />
          <Stop stopColor="#5D2100" offset={1} />
        </LinearGradient>
        <Path
          d="M192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"
          clipRule="evenodd"
          fillRule="evenodd"
          fill="url(#s)"
        />
        <G stroke="#2F8A00">
          <LinearGradient
            x1={-660.23}
            x2={-660.23}
            y1={166.72}
            y2={167.72}
            gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"
            gradientUnits="userSpaceOnUse"
            id="t"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#t)"
          />
          <LinearGradient
            x1={-661.36}
            x2={-661.36}
            y1={164.18}
            y2={165.18}
            gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"
            gradientUnits="userSpaceOnUse"
            id="u"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#u)"
          />
          <LinearGradient
            x1={-656.79}
            x2={-656.79}
            y1={165.15}
            y2={166.15}
            gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"
            gradientUnits="userSpaceOnUse"
            id="v"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M195 183.9c-.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4S211.5 178 195 183.9z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#v)"
          />
          <LinearGradient
            x1={-663.07}
            x2={-663.07}
            y1={165.44}
            y2={166.44}
            gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"
            gradientUnits="userSpaceOnUse"
            id="w"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#w)"
          />
          <LinearGradient
            x1={-662.57}
            x2={-662.57}
            y1={164.44}
            y2={165.44}
            gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"
            gradientUnits="userSpaceOnUse"
            id="x"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M194.9 184.5c35.8-7.6 65.6-.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#x)"
          />
          <LinearGradient
            x1={-656.43}
            x2={-656.43}
            y1={163.86}
            y2={164.86}
            gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"
            gradientUnits="userSpaceOnUse"
            id="y"
          >
            <Stop stopColor="#2F8A00" offset={0} />
            <Stop stopColor="#90FF57" offset={1} />
          </LinearGradient>
          <Path
            d="M194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeWidth={13}
            fill="url(#y)"
          />
          <Path
            d="M196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"
            fill="none"
            strokeLinecap="round"
            strokeWidth={8}
          />
          <Path
            d="M194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8M204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9M196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"
            fill="none"
            strokeLinecap="round"
            strokeWidth={8}
          />
        </G>
      </G>
      <Defs></Defs>
      <Mask
        x={50.5}
        y={399}
        width={532}
        height={633}
        maskUnits="userSpaceOnUse"
        id="A"
      >
        <G filter="url(#z)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#A)">
        <LinearGradient
          x1={-666.06}
          x2={-666.23}
          y1={163.36}
          y2={163.75}
          gradientTransform="matrix(532 0 0 633 354760 -102959)"
          gradientUnits="userSpaceOnUse"
          id="B"
        >
          <Stop stopColor="#FFF400" offset={0} />
          <Stop stopColor="#3C8700" offset={1} />
        </LinearGradient>
        <Ellipse cx={316.5} cy={715.5} rx={266} ry={316.5} fill="url(#B)" />
      </G>
      <Defs></Defs>
      <Mask
        x={391}
        y={-24}
        width={288}
        height={283}
        maskUnits="userSpaceOnUse"
        id="D"
      >
        <G filter="url(#C)">
          <Circle cx={316.5} cy={316.5} r={316.5} fill="#fff" />
        </G>
      </Mask>
      <G mask="url(#D)">
        <LinearGradient
          x1={-664.56}
          x2={-664.56}
          y1={163.79}
          y2={164.79}
          gradientTransform="matrix(227 0 0 227 151421 -37204)"
          gradientUnits="userSpaceOnUse"
          id="E"
        >
          <Stop stopColor="#FFDF00" offset={0} />
          <Stop stopColor="#FF9D00" offset={1} />
        </LinearGradient>
        <Circle cx={565.5} cy={89.5} r={113.5} fill="url(#E)" />
        <LinearGradient
          x1={-644.5}
          x2={-645.77}
          y1={342}
          y2={342}
          gradientTransform="matrix(30 0 0 1 19770 -253)"
          gradientUnits="userSpaceOnUse"
          id="F"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#F)"
          d="M427 89L397 89"
        />
        <LinearGradient
          x1={-641.56}
          x2={-642.83}
          y1={196.02}
          y2={196.07}
          gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"
          gradientUnits="userSpaceOnUse"
          id="G"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#G)"
          d="M430.5 55.5L404 50"
        />
        <LinearGradient
          x1={-643.73}
          x2={-645}
          y1={185.83}
          y2={185.9}
          gradientTransform="matrix(29 0 0 8 19107 -1361)"
          gradientUnits="userSpaceOnUse"
          id="H"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#H)"
          d="M431 122L402 130"
        />
        <LinearGradient
          x1={-638.94}
          x2={-640.22}
          y1={177.09}
          y2={177.39}
          gradientTransform="matrix(24 0 0 13 15783 -2145)"
          gradientUnits="userSpaceOnUse"
          id="I"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#I)"
          d="M442 153L418 166"
        />
        <LinearGradient
          x1={-633.42}
          x2={-634.7}
          y1={172.41}
          y2={173.31}
          gradientTransform="matrix(20 0 0 19 13137 -3096)"
          gradientUnits="userSpaceOnUse"
          id="J"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#J)"
          d="M464 180L444 199"
        />
        <LinearGradient
          x1={-619.05}
          x2={-619.52}
          y1={170.82}
          y2={171.82}
          gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"
          gradientUnits="userSpaceOnUse"
          id="K"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#K)"
          d="M491.4 203L477.5 225.9"
        />
        <LinearGradient
          x1={-578.5}
          x2={-578.63}
          y1={170.31}
          y2={171.31}
          gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"
          gradientUnits="userSpaceOnUse"
          id="L"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#L)"
          d="M524.5 219.5L517 244"
        />
        <LinearGradient
          x1={666.5}
          x2={666.5}
          y1={170.31}
          y2={171.31}
          gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"
          gradientUnits="userSpaceOnUse"
          id="M"
        >
          <Stop stopColor="#FFA400" offset={0} />
          <Stop stopColor="#FF5E00" offset={1} />
        </LinearGradient>
        <Path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={12}
          stroke="url(#M)"
          d="M564.5 228.5L565 253"
        />
      </G>
    </Svg>
  );
}
