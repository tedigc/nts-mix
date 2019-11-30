import styled from 'styled-components';

export const Card = styled.div`
  color: white;
  background-color: black;
  padding: 3rem;
`;

export const Wrapper = styled.div`
  width: 90%;
  max-width: 640px;
  margin: auto;
  position: relative;
`;

export const Main = styled.main`
  padding-top: 1.6rem;
  padding-bottom: 1.6rem;
  height: 100vh;
  overflow-y: scroll;
`;

export const Page = styled.section`
  width: 100%;
  position: absolute;
  top: 0;
`;

export const H1 = styled.h1`
  font-size: 1.6rem;
  line-height: 1;
  text-transform: capitalize;
`;

export const LoadingSpinner = styled.div`
  @keyframes donut-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: inline-block;
  border: 2px solid black;
  border-left-color: white;
  border-radius: 50%;
  width: ${({ size = '16px' }) => size};
  height: ${({ size = '16px' }) => size};
  animation: donut-spin 1.2s linear infinite;
`;
