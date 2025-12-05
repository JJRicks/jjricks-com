// imports for react and react native components
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// main component for the study timer page
export default function StudyTimer() {
    // state variables for timer settings and status
    const [studyMinutes, setStudyMinutes] = useState('');
    const [breakMinutes, setBreakMinutes] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'study' | 'break'>('study');
    const [error, setError] = useState('');
    const [sessionCount, setSessionCount] = useState(0);

    // effect hook to handle the countdown timer logic
    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            // set up an interval to decrease time every second
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Timer finished
            if (mode === 'study') {
                // switch to break mode if study time is up
                const breakTime = parseInt(breakMinutes) * 60;
                if (!isNaN(breakTime) && breakTime > 0) {
                    setMode('break');
                    setTimeLeft(breakTime);
                    setSessionCount(prev => prev + 1);
                } else {
                    setIsActive(false);
                }
            } else {
                // Break finished, switch back to study or stop? 
                // Let's stop for now and let user restart
                setIsActive(false);
                setMode('study');
                alert("Break is over! Ready for another session?");
            }
        }

        // cleanup interval on unmount or dependency change
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, breakMinutes]);

    // function to start the timer and validate inputs
    const startTimer = () => {
        setError('');
        const sMin = parseInt(studyMinutes);
        const bMin = parseInt(breakMinutes);

        // validate that inputs are positive numbers
        if (isNaN(sMin) || sMin <= 0) {
            setError('Please enter a valid positive number for study minutes.');
            return;
        }
        if (isNaN(bMin) || bMin <= 0) {
            setError('Please enter a valid positive number for break minutes.');
            return;
        }

        // if starting fresh, set initial time and mode
        if (!isActive && timeLeft === 0) {
            setTimeLeft(sMin * 60);
            setMode('study');
        }

        setIsActive(true);
    };

    // function to pause the timer
    const stopTimer = () => {
        setIsActive(false);
    };

    // function to reset the timer to initial state
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
        setMode('study');
        setSessionCount(0);
        setError('');
    };

    // helper function to format seconds into mm:ss string
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // pad with leading zeros for consistent display
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // render the component UI
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Study Session Timer</Text>

                <Image
                    source={require('../assets/images/jjricks-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.inputContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Study (min):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={studyMinutes}
                            onChangeText={setStudyMinutes}
                            placeholder="25"
                            placeholderTextColor="#888"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Break (min):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={breakMinutes}
                            onChangeText={setBreakMinutes}
                            placeholder="5"
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.timerContainer}>
                    <Text style={[styles.modeText, mode === 'study' ? styles.studyMode : styles.breakMode]}>
                        {isActive || timeLeft > 0 ? (mode === 'study' ? 'FOCUS TIME' : 'BREAK TIME') : 'READY?'}
                    </Text>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>

                <View style={styles.controls}>
                    {!isActive ? (
                        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startTimer}>
                            <Text style={styles.buttonText}>{timeLeft > 0 ? "Resume" : "Start"}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTimer}>
                            <Text style={styles.buttonText}>Pause</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                {sessionCount > 0 && (
                    <Text style={styles.stats}>Sessions completed: {sessionCount}</Text>
                )}
            </View>
        </ScrollView>
    );
}

// styles for the component
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    logo: {
        width: 100,
        height: 40,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        gap: 10,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        color: '#ccc',
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#444',
    },
    error: {
        color: '#ff6b6b',
        marginBottom: 15,
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 20,
        backgroundColor: '#222',
        borderRadius: 100,
        width: 200,
        height: 200,
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#444',
    },
    modeText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    studyMode: {
        color: '#4dabf7',
    },
    breakMode: {
        color: '#69db7c',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#228be6',
    },
    stopButton: {
        backgroundColor: '#fa5252',
    },
    resetButton: {
        backgroundColor: '#495057',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    stats: {
        marginTop: 20,
        color: '#888',
        fontSize: 14,
    },
});
