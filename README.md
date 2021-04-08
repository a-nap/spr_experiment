# Self-Paced Reading Study for PCIbex

This is an experiment template in which participants read sentences in segments
and occasionally have to answer a comprehension question. The experiment 
consists of the following parts:

1. Obligatory ethics agreement
2. Form for inputting general demographic participant information (ID, native
languages, federal state, age, gender, handedness)
3. Instructions
4. Exercise
5. Continue to experiment display
6. Main experiment sequence
7. End screen and experiment explanation

The experiment is in German but the comments and the majority of the code is in 
English.

Once the participants consent to the ethics agreement, the list (or group) 
counter switches to the next list/group. This is because in my experiments, 
multiple participants can start the experiment simultaneously. By default, PCIbex
switches to the next list once the participant has finished the experiment.

## Task description

Before the start of the experiment, participants are asked to consent to the
ethics agreement. Then they must fill in general questions concerning their age,
 gender, handedness, native languages etc. Next, they read instructions 
detailing the experimental task and giving examples of an experimental trial. 
Next, they practice the task in an exercise, before continuing to the main 
experiment. After completing the experiment, the participants are informed about 
the purpose of the study and are informed about their accuracy. At the end of 
the study, a random code is generated that the participants should email to the 
principal researcher in order to receive compensation.

In the exercise and the main experiment, the sentences are presented in 
increments (phrase-by-phrase). 
The participants control when each segment of the the sentence is presented by 
pressing the space bar. At the beginning of a trial, an asterisk (\*) appears. 
Then, the sentence is presented entirely, with letters substituted for dashes. 
When the participants press the space bar, the first part of the sentence 
appears in place of the dashes. The remainder of the sentence is still concealed 
behind dashes. Each time the participants press the space bar, a new sentence 
segment appears and the previous one disappears. The participants can move 
forward in the sentence but cannot revisit the sentence parts they have already 
read. After the last segment, the trial ends with another press of the space bar. 

The sentence presentation is occasionally followed by a question display. The 
participants use two predetermined keys to answer the questions. The two 
possible answers are presented on the left and on the right of the screen. The 
distribution of the answers is randomized. In the practice trials, feedback is 
provided for both correct and incorrect answers, but in the experimental 
trials feedback and a slight delay are provided when an incorrect answer is 
given. This is to discourage incorrect responses.

In the exercise, the order of the sentences is random. In the main experiment 
procedure, the stimuli presentation is randomly shuffled between critical items
and distractor sentences.


## Contributing

Pull requests are welcome. For major changes, please open an issue first to 
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Copyright (c) 2021 Anna Prysłopska pryslopska.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to use, 
copy, modify, merge, publish, distribute, and sublicense copies of the Software,
and to permit persons to whom the Software is furnished to do so.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.