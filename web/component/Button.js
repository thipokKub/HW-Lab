import styled, { css } from 'styled-components';

export default styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 15px rgba(0,0,0,0.3);

  &:hover {
    box-shadow: 0px 4px 15px rgba(0,0,0,0.3);
  }

  &:active {
    box-shadow: none;
  }


  ${({ color }) => color && css`
    background-color: ${color};
  `}

  ${({ outline }) => outline && css`
    background: rgba(0, 0, 0, 0);
    border: 3px solid #FFF;
    box-shadow: 0px 2px 15px rgba(0,0,0,0.3), 0px 2px 15px rgba(0,0,0,0.3) inset;
    text-shadow: 0px 2px 5px rgba(0,0,0,0.3);

    &:hover {
      box-shadow: 0px 4px 15px rgba(0,0,0,0.3), 0px 4px 15px rgba(0,0,0,0.3) inset;
      text-shadow: 0px 4px 5px rgba(0,0,0,0.3);
    }

    &:active {
      box-shadow: none;
      text-shadow: none;
    }
  `}

  ${({ outline, color }) => outline && color && css`
    border-color: ${color};
    color: ${color};
  `}
`;
