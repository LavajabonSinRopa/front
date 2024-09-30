Para correr los test hay que instalar varias dependencias:

npm install jest
npm install --save-dev jest-environment-jsdom
npm install --save-dev @babel/preset-env @babel/core babel-jest
npm install --save-dev @babel/preset-react
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev jest-websocket-mock

(Entre otras que no recuerdo) 

El test se corre con "npm test". Para correr el programa de forma normal usar "npm run dev".