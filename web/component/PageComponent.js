import styled from 'styled-components';

export default styled.div`
background: #FFD3F0;
width: 100%;
height: 100vh;
display: flex;
flex-direction: column;
color: #FFF;

nav.head {
    background-color: #8024C4;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
}

.body {
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}

.fa {
    font-size: 1.5em;
}

.mar-r-5 {
  margin-right: 5px;
}

.mar-b-40 {
  margin-bottom: 40px;
}

span.black {
  color: #000;
}

`;