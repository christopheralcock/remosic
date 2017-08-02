    //DRUMS//

    //and a compressor
    var drumCompress = new Tone.Compressor({
        "threshold": -20,
            "ratio": 6,
            "attack": 0.3,
            "release": 0.1
        }).toMaster();

        var distortion = new Tone.Distortion({
        "distortion": 1,
            "wet": 0.8
        });

        //hats
        var hats = new Tone.Sampler({
        "url": "https://tonejs.github.io/examples/audio/505/hh.mp3",
            "volume": -10,
            "envelope": {
        "attack": 0.011,
                "decay": 0.02,
                "sustain": 0.01,
                "release": 1.01
            }
        }).chain(distortion, drumCompress);

        var hatsLoop = new Tone.Loop({
        "callback": function (time) {
        hats.triggerAttackRelease(0, "8n", time);
    },
            "interval": "16n",
            "probability": 0.8
        }).start("0m");

        //SNARE PART
        var snare = new Tone.Sampler({
        "url": "https://tonejs.github.io/examples/audio/505/snare.mp3",
            "envelope": {
        "attack": 0.01,
                "decay": 1,
                "sustain": 1
            },
        }).chain(distortion).toMaster()

        var snarePart = new Tone.Sequence(function (time, velocity) {
        snare.triggerAttackRelease(0, "8n", time, velocity);
    }, [null, null, [1, 1], [1, 1], null, null, 1, [null, .6]]).start(0);

        var kick = new Tone.MembraneSynth({
        "pitchDecay": 0.01,
            "octaves": 6,
            "oscillator": {
        "type": "square4"
            },
            "envelope": {
        "attack": 0.001,
                "decay": .2,
                "sustain": .2
            }
        }).connect(drumCompress);

        var kickPart = new Tone.Sequence(function (time, probability) {
            if (Math.random() < probability) {
        kick.triggerAttack("C1", time);
    }
        }, [1, 1, null, null, 1, 1, null, null], "1n").start(0);

        // BASS
        var bass = new Tone.MonoSynth(

            {
        "filter": {
        type: "lowpass",
                    frequency: 3500,
                    rolloff: -12,
                    Q: 0,
                    gain: 10
                }
            }
        ).connect(drumCompress);


        var bassPart = new Tone.Part(function (time, event) {
            if (Math.random() < event.prob) {
        bass.triggerAttackRelease(event.note, event.dur, time);
    }
        },


            [



                {time: "0", note: "B1", dur: "16n", prob: 1 }
        ).start(0);

        bassPart.loop = true;
        bassPart.loopEnd = "16m";

        //SYNTH
        var synth = new Tone.DuoSynth({
        "vibratoAmount": 0.5,
            "vibratoRate": 5,
            "portamento": 0.1,
            "harmonicity": 1.005,
            "volume": 1,
            "voice0": {
        "volume": -2,
                "oscillator": {
        "type": "sawtooth"
                },
                "filter": {
        "Q": 1,
                    "type": "lowpass",
                    "rolloff": -24
                },
                "envelope": {
        "attack": 0.01,
                    "decay": 0.25,
                    "sustain": 1,
                    "release": 1.2
                },
                "filterEnvelope": {
        "attack": 0.001,
                    "decay": 0.05,
                    "sustain": 1,
                    "release": 2,
                    "baseFrequency": 100,
                    "octaves": 4
                }
            },
            "voice1": {
        "volume": 10,
                "oscillator": {
        "type": "sawtooth"
                },
                "filter": {
        "Q": 2,
                    "type": "bandpass",
                    "rolloff": -12
                },
                "envelope": {
        "attack": 0.25,
                    "decay": 4,
                    "sustain": 0.1,
                    "release": 0.8
                },
                "filterEnvelope": {
        "attack": 0.05,
                    "decay": 0.05,
                    "sustain": 0.7,
                    "release": 2,
                    "baseFrequency": 5000,
                    "octaves": -1.5
                }
            }
        }).toMaster();

        var synthNotes = ["B3", "C#4", "D#4", "E4", "F#4", "G#4", "A#4", "B4"];

        Tone.Transport.bpm.value = 120;

        // GUI //

        Interface.Button({
        key: 32,
            type: "toggle",
            text: "Start",
            activeText: "Stop",
            start: function () {
        Tone.Transport.start("+0.1");
    $.connection.stockTicker.server.openMarket();
            },
            end: function () {
        Tone.Transport.stop();
    $.connection.stockTicker.server.closeMarket();
            }
        });

        var lastSynthNote = synthNotes[0];
        Interface.Dragger({
        // container : "#Content",
        x: {
        options: synthNotes,
                drag: function (note) {
        synth.setNote(note);
    lastSynthNote = note;
                }
            },
            y: {
        min: 0,
                max: 2,
                drag: function (val) {
        synth.vibratoAmount.value = val;
    }
            },
            start: function () {
        synth.triggerAttack(lastSynthNote);
    },
            end: function () {
        synth.triggerRelease();
    },
            name: "Synth"
        });

        Interface.Loader();