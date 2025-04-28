 {
  display: flex;
  justify-content: center;
}

.ball {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color:rgb(34, 255, 170);
  animation: bounce 0.5s;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
  animation-iteration-count: infinite;
};