import Svg, { Path, Circle } from 'react-native-svg';

interface PokemonTypeIconProps {
  type: string;
  size?: number;
  color?: string;
}

export function PokemonTypeIcon({ type, size = 16, color = '#FFFFFF' }: PokemonTypeIconProps) {
  const normType = type.toLowerCase();

  switch (normType) {
    case 'all':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <Path
            d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z"
            stroke={color}
            strokeWidth="2"
          />
          <Path d="M3 12h18" stroke={color} strokeWidth="2" />
        </Svg>
      );

    case 'fire':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            fill={color}
          />
          <Path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" fill="#FFFFFF" opacity={0.35} />
        </Svg>
      );

    case 'water':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" fill={color} />
        </Svg>
      );

    case 'grass':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 22c0-5.52 4.48-10 10-10S22 7.52 22 2c0 5.52-4.48 10-10 10S2 16.48 2 22z"
            fill={color}
          />
          <Path
            d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            fill="#FFFFFF"
            opacity={0.3}
          />
        </Svg>
      );

    case 'electric':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} />
        </Svg>
      );

    case 'ice':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2v20M2 12h20M12 12L5 5m14 14l-7-7 7-7M5 19l7-7"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'fighting':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 13.5v-3l-3-1.5 3-1.5v-3h4v3l3 1.5-3 1.5v3h-4z"
            fill={color}
            fillRule="evenodd"
          />
        </Svg>
      );

    case 'poison':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2a8 8 0 00-8 8c0 3.3 2 6.2 5 7.4V20a2 2 0 002 2h2a2 2 0 002-2v-2.6c3-1.2 5-4.1 5-7.4a8 8 0 00-8-8zm-2 7a2 2 0 114 0 2 2 0 01-4 0z"
            fill={color}
          />
        </Svg>
      );

    case 'ground':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L2 14h20L12 2z" fill={color} />
          <Path d="M2 18h20v4H2v-4z" fill={color} opacity={0.7} />
        </Svg>
      );

    case 'flying':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21.9 6c-.3-.2-8.3-4-9.9-4S2.4 5.8 2.1 6c-.3.2-.2.5.1.6 1 .4 8 3.4 9.8 3.4s8.8-3 9.8-3.4c.3-.1.4-.4.1-.6zM12 11c-4.4 0-8.8 2.2-9.9 2.7-.3.1-.3.5 0 .6.7.3 5.3 2.7 9.9 2.7s9.2-2.4 9.9-2.7c.3-.1.3-.5 0-.6-1.1-.5-5.5-2.7-9.9-2.7zm0 7c-3.3 0-6.6 1.7-7.4 2-.3.1-.3.5 0 .6.5.2 4 2.1 7.4 2.1s6.9-1.9 7.4-2.1c.3-.1.3-.5 0-.6-.8-.3-4.1-2-7.4-2z"
            fill={color}
          />
        </Svg>
      );

    case 'psychic':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
            fill={color}
          />
          <Circle cx="12" cy="12" r="3" fill="#FFFFFF" opacity={0.8} />
        </Svg>
      );

    case 'bug':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 13a7 7 0 01-14 0c0-2.3 1.1-4.3 2.8-5.6l-1.4-1.4A8.96 8.96 0 003 13a9 9 0 0018 0c0-2.9-1.4-5.5-3.6-7l-1.4 1.4c1.8 1.3 3 3.3 3 5.6zM12 2a4 4 0 00-4 4h8a4 4 0 00-4-4z"
            fill={color}
          />
          <Circle cx="8.5" cy="11.5" r="1.5" fill={color} />
          <Circle cx="15.5" cy="11.5" r="1.5" fill={color} />
        </Svg>
      );

    case 'rock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L2 9l3 11h14l3-11L12 2zm0 4.5l5.5 3.8-1.5 6.2H8L6.5 10.3 12 6.5z"
            fill={color}
            fillRule="evenodd"
          />
        </Svg>
      );

    case 'ghost':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2a9 9 0 00-9 9v11l3-2 3 2 3-2 3 2 3-2 3 2V11a9 9 0 00-9-9zm-3 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            fill={color}
          />
        </Svg>
      );

    case 'dragon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L4 7v10l8 5 8-5V7l-8-5zm4 7l-4 8.5L8 9h8z"
            fill={color}
            fillRule="evenodd"
          />
        </Svg>
      );

    case 'dark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a7 7 0 11-7.54-7.54c-.44-.06-.9-.1-1.36-.1z"
            fill={color}
            fillRule="evenodd"
          />
        </Svg>
      );

    case 'steel':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="3" />
          <Circle cx="12" cy="12" r="3" fill={color} />
        </Svg>
      );

    case 'fairy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z"
            fill={color}
          />
        </Svg>
      );

    case 'normal':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="3" />
        </Svg>
      );
  }
}
