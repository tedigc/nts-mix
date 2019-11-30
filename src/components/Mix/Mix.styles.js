import styled, { css } from 'styled-components';

export const DJ = styled.h2`
  font-size: 2.4rem;
  line-height: 2.8rem;
  text-transform: uppercase;
  font-weight: 700;
`;

export const Location = styled.p`
  text-transform: uppercase;
  font-family: UniversCondensed;
`;

export const Hr = styled.hr`
  border: none;
  height: 1px;
  color: white;
  background-color: white;
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
`;

export const Description = styled.p`
  font-size: 1.3rem;
  margin-bottom: 3.2rem;
`;

export const Track = styled.li`
  height: 4.4rem;
  margin-bottom: 2.2rem;

  transition: all 0.3s ease-in-out;

  &.active {
    margin-left: 3.2rem;
  }

  &.complete {
    opacity: 0.3;
  }
`;

export const Artist = styled.span`
  font-family: UniversCondensed;
  text-transform: uppercase;
  font-weight: 700;
  display: block;
  color: white;
  line-height: 2.24rem;
  margin-bottom: 0.5rem;
`;

export const Title = styled.span`
  font-size: 1.3rem;
  line-height: 1.4rem;
  color: white;
`;

export const BioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const commonStyles = css`
  text-transform: uppercase;
  border: 1px solid white;
  height: 3.2rem;
  background-color: black;
  font-family: UniversCondensed;
  font-size: 1.6rem;
  white-space: nowrap;
  padding-left: 1.6rem;
  padding-right: 1.6rem;
  transition: opacity 0.15s ease-in-out;
  cursor: pointer;
  outline: none;

  &:hover {
    opacity: 0.75;
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const Button = styled.button`
  ${commonStyles}
`;

export const Link = styled.a`
  ${commonStyles}
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`;
