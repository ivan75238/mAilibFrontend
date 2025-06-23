import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Thin.ttf') format('ttf');
    font-weight: 100;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-UltraLight.ttf') format('ttf');
    font-weight: 200;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Light.ttf') format('ttf');
    font-weight: 300;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Regular.ttf') format('ttf');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Medium.ttf') format('ttf');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-SemiBold.ttf') format('ttf');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Bold.ttf') format('ttf');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-ExtraBold.ttf') format('ttf');
    font-weight: 800;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('./assets/fonts/Gilroy-Black.ttf') format('ttf');
    font-weight: 900;
  }

  .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item:hover {
      background: #efe3fd !important;
    }

  .p-autocomplete-panel{
    border-radius: 12px;
  }
`;

export default GlobalStyle;
