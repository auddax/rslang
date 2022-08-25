/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import environment from '../../../environment/environment';
import { GAMES } from '../../../types/enums';
import { ISprintGame, IGameResult, IWords } from '../../../types/interfaces';
import { shuffleArray } from '../../../utils/utils';
import GameResult from '../../GameResult/gameResult';
import './sprintGame.scss';

class SprintGame implements ISprintGame {
  currentWordIndex: number;

  score: number;

  time: number;

  timerId: NodeJS.Timer | undefined;

  gameType: GAMES;

  words: IWords[];

  shuffledWords: IWords[];

  result: IGameResult;

  constructor(gameType: GAMES) {
    this.currentWordIndex = environment.wordsIndexDefault;
    this.score = environment.scoreDefault;
    this.time = environment.timerSprintDefault;
    this.timerId = undefined;
    this.gameType = gameType;
    this.words = [];
    this.shuffledWords = [];
    this.result = new GameResult(this.gameType);
  }

  listen(target: HTMLElement) {
    this.answerSprintGameMouse(target);
  }

  start(words: IWords[]) {
    this.stop();
    this.score = environment.scoreDefault;
    this.words = words;
    this.shuffledWords = shuffleArray(words, environment.shuffleSprintStep);
    this.render(
      this.words[this.currentWordIndex].word,
      this.shuffledWords[this.currentWordIndex].wordTranslate,
      this.score,
    );
    this.timer();
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = undefined;
    this.time = environment.timerSprintDefault;
    this.currentWordIndex = environment.wordsIndexDefault;
  }

  answerSprintGameMouse(target: HTMLElement) {
    if (!target.classList.contains('answer-sprint-game')) return;
    const wordOrigin = this.words[this.currentWordIndex].word;
    const wordShuffled = this.shuffledWords[this.currentWordIndex].word;

    if (wordOrigin === wordShuffled) {
      if (target.id === 'sprintGameTrue') this.score += environment.scoreIncrement;
    } else if (target.id === 'sprintGameFalse') this.score += environment.scoreIncrement;

    if (this.currentWordIndex + 1 >= environment.wordsNumber) {
      this.result.render(this.score);
      this.stop();
    } else {
      this.currentWordIndex += 1;
      this.render(
        this.words[this.currentWordIndex].word,
        this.shuffledWords[this.currentWordIndex].wordTranslate,
        this.score,
      );
    }
  }

  answerSprintGameKey(eventCode: string) {
    if (!(eventCode === 'ArrowRight' || eventCode === 'ArrowLeft')) return;
    if (!this.timerId) return;
    const wordOrigin = this.words[this.currentWordIndex].word;
    const wordShuffled = this.shuffledWords[this.currentWordIndex].word;

    if (wordOrigin === wordShuffled) {
      if (eventCode === 'ArrowRight') this.score += environment.scoreIncrement;
    } else if (eventCode === 'ArrowLeft') this.score += environment.scoreIncrement;

    if (this.currentWordIndex + 1 >= environment.wordsNumber) {
      this.result.render(this.score);
      this.stop();
    } else {
      this.currentWordIndex += 1;
      this.render(
        this.words[this.currentWordIndex].word,
        this.shuffledWords[this.currentWordIndex].wordTranslate,
        this.score,
      );
    }
  }

  timer() {
    const startTime = Date.now();
    let timePassed = 0;
    this.timerId = setInterval(() => {
      timePassed = Date.now() - startTime;
      this.time = Math.floor(timePassed / 1000);
      if (this.time > environment.timerSprintMax) {
        this.result.render(this.score);
        this.stop();
        return;
      }
      const timerElement = document.querySelector('.timer__value');
      if (timerElement) timerElement.innerHTML = String(this.time);
    }, environment.timerSprintInterval);
    this.time = environment.timerSprintDefault;
  }

  render(word: string, translate: string, score: number) {
    const main = document.querySelector('.page-content');
    if (main) {
      main.innerHTML = `
        <section class="sprint-game">
          <div class="sprint-game__card">
            <div class="sprint-game__timer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 5.7l-4.6-3.9-1.3 1.5 4.6 3.9L22 5.7zM7.9 3.4L6.6 1.9 2 5.7l1.3 1.5 4.6-3.8zM12.5 8H11v6l4.7 2.9.8-1.2-4-2.4V8zM12 4c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/>
              </svg>
              <div class="timer__value">${this.time}</div>
            </div>
            <div class="sprint-game__result">
              Score: ${String(score)}
            </div>
            <div class="sprint-game__words">
              <p>${word}</p>
              <p>${translate}</p>
            </div>
            <form>
              <button type="button" class="button answer-sprint-game" id="sprintGameFalse">False</button>
              <button type="button" class="button answer-sprint-game" id="sprintGameTrue">True</button>
            </form>
          </div>
        </section>
      `;
    }
  }
}

export default SprintGame;
