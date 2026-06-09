const THEME_KEY = 'ageCalculator_theme';
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
function setMaxDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').max = today;
}
function clearError() {
    document.getElementById('errorMessage').textContent = '';
}
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
}
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}
function isFutureDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}
function calculateAge(birthDate) {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days };
}
function calculateTotalDays(birthDate) {
    const today = new Date();
    const timeDifference = today - birthDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}
function calculateTotalHours(birthDate) {
    const today = new Date();
    const timeDifference = today - birthDate;
    return Math.floor(timeDifference / (1000 * 60 * 60));
}
function calculateTotalMinutes(birthDate) {
    const today = new Date();
    const timeDifference = today - birthDate;
    return Math.floor(timeDifference / (1000 * 60));
}
function calculateNextBirthday(birthDate) {
    const today = new Date();
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
        nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const timeDifference = nextBirthday - today;
    const daysUntilBirthday = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysUntilBirthday;
}
function formatBirthdayCountdown(days) {
    if (days === 0) {
        return '🎉 Happy Birthday! 🎉';
    } else if (days === 1) {
        return '1 day away!';
    } else {
        return `${days} days away`;
    }
}
function displayResults(birthDate) {
    const age = calculateAge(birthDate);
    const totalDays = calculateTotalDays(birthDate);
    const totalHours = calculateTotalHours(birthDate);
    const totalMinutes = calculateTotalMinutes(birthDate);
    const daysUntilBirthday = calculateNextBirthday(birthDate);
    document.getElementById('exactAge').textContent = `${age.years} years, ${age.months} months, ${age.days} days`;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();
    document.getElementById('birthdayCountdown').textContent = formatBirthdayCountdown(daysUntilBirthday);
    document.getElementById('result').classList.remove('hidden');
}
function handleCalculate() {
    const dobInput = document.getElementById('dob').value;
    clearError();
    if (!dobInput) {
        showError('Please select your date of birth');
        document.getElementById('result').classList.add('hidden');
        return;
    }
    if (!isValidDate(dobInput)) {
        showError('Invalid date format');
        document.getElementById('result').classList.add('hidden');
        return;
    }
    if (isFutureDate(dobInput)) {
        showError('Date of birth cannot be in the future');
        document.getElementById('result').classList.add('hidden');
        return;
    }
    const birthDate = new Date(dobInput);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 0 || age > 150) {
        showError('Please enter a valid date of birth');
        document.getElementById('result').classList.add('hidden');
        return;
    }
    displayResults(birthDate);
}
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setMaxDate();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('calculate').addEventListener('click', handleCalculate);
    document.getElementById('dob').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleCalculate();
        }
    });
});
