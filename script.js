const THEME_KEY = 'age-calculator-theme';
let birthMoment = null;
let liveUpdateInterval = null;

function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setMaxDate() {
    document.getElementById('dob').max = getLocalDateString(new Date());
}

function clearError() {
    document.getElementById('errorMessage').textContent = '';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
}

function hideResults() {
    document.getElementById('result').classList.add('hidden');
}

function stopLiveUpdates() {
    if (liveUpdateInterval !== null) {
        clearInterval(liveUpdateInterval);
        liveUpdateInterval = null;
    }
}

function getBirthMoment() {
    const dateValue = document.getElementById('dob').value;
    const timeValue = document.getElementById('birthTime').value;

    if (!dateValue) {
        return { error: 'Please select your date of birth' };
    }

    if (!timeValue) {
        return { error: 'Please select your time of birth' };
    }

    const dateParts = dateValue.split('-').map(Number);
    const timeParts = timeValue.split(':').map(Number);
    const [year, month, day] = dateParts;
    const [hours, minutes, seconds = 0] = timeParts;
    const birthDate = new Date(year, month - 1, day, hours, minutes, seconds);

    const isValidDate = birthDate.getFullYear() === year &&
        birthDate.getMonth() === month - 1 &&
        birthDate.getDate() === day &&
        birthDate.getHours() === hours &&
        birthDate.getMinutes() === minutes &&
        birthDate.getSeconds() === seconds;

    if (!isValidDate || timeParts.length < 2 || timeParts.length > 3) {
        return { error: 'Please enter a valid birth date and time' };
    }

    return { birthDate };
}

function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function createBirthdayMoment(year, birthDate) {
    const day = Math.min(birthDate.getDate(), getLastDayOfMonth(year, birthDate.getMonth()));
    return new Date(
        year,
        birthDate.getMonth(),
        day,
        birthDate.getHours(),
        birthDate.getMinutes(),
        birthDate.getSeconds(),
        birthDate.getMilliseconds()
    );
}

function addMonths(date, months) {
    const targetMonth = date.getMonth() + months;
    const targetYear = date.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const day = Math.min(date.getDate(), getLastDayOfMonth(targetYear, normalizedMonth));
    return new Date(
        targetYear,
        normalizedMonth,
        day,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
}

function calculateAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let anniversary = createBirthdayMoment(birthDate.getFullYear() + years, birthDate);

    if (anniversary > currentDate) {
        years -= 1;
        anniversary = createBirthdayMoment(birthDate.getFullYear() + years, birthDate);
    }

    let months = currentDate.getMonth() - anniversary.getMonth();
    if (months < 0) {
        months += 12;
    }

    let monthAnchor = addMonths(anniversary, months);
    if (monthAnchor > currentDate) {
        months -= 1;
        monthAnchor = addMonths(anniversary, months);
    }

    const remainingMilliseconds = currentDate - monthAnchor;
    const totalSeconds = Math.floor(remainingMilliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds };
}

function getElapsedMilliseconds(birthDate, currentDate) {
    return Math.max(0, currentDate - birthDate);
}

function calculateNextBirthday(birthDate, currentDate) {
    const sameBirthdayDate = currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() === Math.min(birthDate.getDate(), getLastDayOfMonth(currentDate.getFullYear(), birthDate.getMonth()));
    let nextBirthday = createBirthdayMoment(currentDate.getFullYear(), birthDate);
    const birthdayToday = sameBirthdayDate && nextBirthday <= currentDate;

    if (nextBirthday <= currentDate) {
        nextBirthday = createBirthdayMoment(currentDate.getFullYear() + 1, birthDate);
    }

    return {
        birthdayToday,
        milliseconds: nextBirthday - currentDate
    };
}

function formatExactAge(age) {
    return `${age.years} years, ${age.months} months, ${age.days} days, ${age.hours} hours, ${age.minutes} minutes, ${age.seconds} seconds`;
}

function formatCountdown(milliseconds, birthdayToday) {
    if (birthdayToday) {
        return 'Happy Birthday!';
    }

    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} days ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function displayResults(birthDate, currentDate = new Date()) {
    const age = calculateAge(birthDate, currentDate);
    const elapsedMilliseconds = getElapsedMilliseconds(birthDate, currentDate);
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const nextBirthday = calculateNextBirthday(birthDate, currentDate);

    document.getElementById('exactAge').textContent = formatExactAge(age);
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();
    document.getElementById('totalSeconds').textContent = totalSeconds.toLocaleString();
    document.getElementById('birthdayCountdown').textContent = formatCountdown(nextBirthday.milliseconds, nextBirthday.birthdayToday);
    document.getElementById('liveStatus').textContent = `Live update: ${currentDate.toLocaleTimeString()}`;
    document.getElementById('result').classList.remove('hidden');
}

function startLiveUpdates() {
    stopLiveUpdates();
    liveUpdateInterval = setInterval(() => {
        if (birthMoment) {
            displayResults(birthMoment);
        }
    }, 1000);
}

function handleCalculate(showValidation = true) {
    clearError();
    const result = getBirthMoment();

    if (result.error) {
        stopLiveUpdates();
        birthMoment = null;
        hideResults();
        if (showValidation) {
            showError(result.error);
        }
        return false;
    }

    const currentDate = new Date();
    if (result.birthDate > currentDate) {
        stopLiveUpdates();
        birthMoment = null;
        hideResults();
        if (showValidation) {
            showError('Date and time of birth cannot be in the future');
        }
        return false;
    }

    const age = calculateAge(result.birthDate, currentDate);
    if (age.years > 150) {
        stopLiveUpdates();
        birthMoment = null;
        hideResults();
        if (showValidation) {
            showError('Please enter a valid date of birth');
        }
        return false;
    }

    birthMoment = result.birthDate;
    displayResults(birthMoment, currentDate);
    startLiveUpdates();
    return true;
}

function handleInputChange() {
    const dateValue = document.getElementById('dob').value;
    const timeValue = document.getElementById('birthTime').value;
    clearError();

    if (dateValue && timeValue) {
        handleCalculate(false);
    } else {
        stopLiveUpdates();
        birthMoment = null;
        hideResults();
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        handleCalculate(true);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setMaxDate();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('calculate').addEventListener('click', () => handleCalculate(true));
    document.getElementById('dob').addEventListener('input', handleInputChange);
    document.getElementById('birthTime').addEventListener('input', handleInputChange);
    document.getElementById('dob').addEventListener('keydown', handleEnter);
    document.getElementById('birthTime').addEventListener('keydown', handleEnter);
    window.addEventListener('beforeunload', stopLiveUpdates);
});
