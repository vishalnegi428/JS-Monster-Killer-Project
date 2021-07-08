const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const logEntries = [];
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_HEAL = "HEAL";
const LOG_RESET = "RESET";

function getUserInput() {
	const enteredValue = prompt(
		"Enter the starting health of both Player and Monster",
		"100"
	);
	let parsedValue = parseInt(enteredValue);
	if (isNaN(parsedValue) || parsedValue < 0) {
		throw {
			message:
				"Invalid Input! It have to be a positive Number. Starting Health set to 100.",
		};
	}
	return parsedValue;
}

let maxHealth;

try {
	maxHealth = getUserInput();
} catch (error) {
	console.log(error);
	maxHealth = 100;
	alert("Starting Health set to 100.");
}

let currentMonsterHealth = maxHealth;
let currentPlayerHealth = maxHealth;
let hasBonusLife = true;

adjustHealthBars(maxHealth);

function entries(event, value, MonsterHealth, PlayerHealth) {
	if (event === LOG_PLAYER_ATTACK || event === LOG_PLAYER_STRONG_ATTACK) {
		logEntry = {
			event: event,
			value: value,
			target: "MONSTER",
			currentMonsterHealth: MonsterHealth,
			currentPlayerHealth: PlayerHealth,
		};
	} else if (event === LOG_MONSTER_ATTACK || event === LOG_HEAL) {
		logEntry = {
			event: event,
			value: value,
			target: "PLAYER",
			currentMonsterHealth: MonsterHealth,
			currentPlayerHealth: PlayerHealth,
		};
	} else if (event === LOG_RESET) {
		logEntry = {
			event: event,
			result: value,
			currentMonsterHealth: MonsterHealth,
			currentPlayerHealth: PlayerHealth,
		};
	}

	logEntries.push(logEntry);
}

function healthManager() {
	const initialHealth = currentPlayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;
	entries(
		LOG_MONSTER_ATTACK,
		playerDamage,
		currentMonsterHealth,
		currentPlayerHealth
	);

	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();
		currentPlayerHealth = initialHealth;
		setPlayerHealth(initialHealth);
		alert("Your extra life is used now.");
	}
	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert("You Win!");
		entries(LOG_RESET, "WIN", currentMonsterHealth, currentPlayerHealth);
		reset();
	} else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
		alert("You Lose!");
		entries(LOG_RESET, "LOSE", currentMonsterHealth, currentPlayerHealth);
		reset();
	} else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
		alert("Draw!");
		entries(LOG_RESET, "DRAW", currentMonsterHealth, currentPlayerHealth);
		reset();
	}
}

function reset() {
	currentMonsterHealth = maxHealth;
	currentPlayerHealth = maxHealth;
	resetGame(maxHealth);
}

function attackMonster(mode) {
	let damageMode = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
	let logEvent =
		mode === MODE_ATTACK ? LOG_PLAYER_ATTACK : LOG_PLAYER_STRONG_ATTACK;
	/*
	if (mode === MODE_ATTACK) {
		damageMode = ATTACK_VALUE;
		logEvent = LOG_PLAYER_ATTACK;
	} else if (mode === MODE_STRONG_ATTACK) {
		damageMode = STRONG_ATTACK_VALUE;
		logEvent = LOG_PLAYER_STRONG_ATTACK;
	}*/

	const damage = dealMonsterDamage(damageMode);
	currentMonsterHealth -= damage;
	entries(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

	healthManager();
}

function attackHandler() {
	attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
	attackMonster(MODE_STRONG_ATTACK);
}

function healHandler() {
	let healValue;
	if (currentPlayerHealth >= maxHealth - HEAL_VALUE) {
		alert("Your Health is Full.Can't go beyond Max Health!");
		healValue = maxHealth - currentPlayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	entries(LOG_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
	healthManager();
}

function logHandler() {
	console.log(logEntries);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", logHandler);
