/* This software is licensed under a BSD license; see the LICENSE file for details. */

function boolToInt(x) { if (x) return 1; else return 0; }

const splitWords = (inputString, regex = /[ \t]+/) =>
      inputString
      // replace all linebreaks (and surrounding space) with 'space-return-space'
      .replace(/\s*[\r\n]\s*/g, " \r ")
      .split(regex);

function prepareDashedSentence() {
  this.wordISpans = []; // Inner spans.
  this.wordOSpans = []; // Outer spans.
  this.owsnjq = []; // 'outer word spans no jQuery'.
  this.iwsnjq = []; // 'inner word spans no jQuery'.
  for (var j = 0; j < this.words.length; ++j) {
    if ( this.words[j] == "\r" ) {
      this.mainDiv.append('<br/>');

      if (j <= this.stoppingPoint)
        this.stoppingPoint--;
      continue;
    }

    var ispan;
    var ospan = $(document.createElement("span"))
        .addClass(this.cssPrefix + 'ospan')
        .append(ispan = $(document.createElement("span"))
                .addClass(this.cssPrefix + 'ispan')
                .text(this.words[j]));
    if (! this.showAhead)
      ospan.css('border-color', this.background);
    this.mainDiv.append(ospan);
    if (j + 1 < this.words.length)
      this.mainDiv.append("&nbsp; ");
    this.wordISpans.push(ispan);
    this.wordOSpans.push(ospan);
    this.iwsnjq.push(ispan[0]);
    this.owsnjq.push(ospan[0]);
  }
}

function setOptions() {
  this.cssPrefix = this.options._cssPrefix;
  this.utils = this.options._utils;
  this.finishedCallback = this.options._finishedCallback;

  if (typeof(this.options.s) == "string") {
    this.words = splitWords(this.options.s, this.options.splitRegex);
  } else {
    assert_is_arraylike(this.options.s, "Bad value for 's' option of DashedSentence.");
    this.words = this.options.s;
  }

  this.showAhead = dget(this.options, "showAhead", true);
  this.showBehind = dget(this.options, "showBehind", true);
  this.hideUnderscores = dget(this.options, "hideUnderscores", true);

  // Defaults.
  this.unshownBorderColor = dget(this.options, "unshownBorderColor", "#9ea4b1");
  this.shownBorderColor = dget(this.options, "shownBorderColor", "black");

  this.sentenceDescType = dget(this.options, "sentenceDescType", "literal");
  this.stoppingPoint = this.words.length;
}

const advanceToken = (startTime, state) => {
  if (state.currentWord > 0 && state.currentWord <= state.stoppingPoint) {
    var rs = state.sprResults[state.currentWord-1];
    rs[0] = startTime;
    rs[1] = state.previousTime;
  }
  state.previousTime = startTime;

  if (state.currentWord - 1 >= 0)
    state.blankWord(state.currentWord - 1);
  if (state.currentWord < state.stoppingPoint)
    state.showWord(state.currentWord);
  ++(state.currentWord);
  if (state.currentWord > state.stoppingPoint) {
    state.processSprResults();
    state.finishedCallback(state.resultsLines);
  }
}

const onKeyDown = (state) => (event) => {
  if (event.keyCode === 32) {
    advanceToken(new Date().getTime(), state)
    return true;
  }
  return false;
}

define_ibex_controller({
  name: "SelfPacedReadingParadigmSentence",

  jqueryWidget: {
    _init: function() {
      setOptions.apply(this);
      this.currentWord = 0;

      if (this.hideUnderscores) {
        this.words = $.map(this.words, function(word) { return word.replace(/_/g, ' ') });
      }

      this.mainDiv = $("<div>");
      this.element.append(this.mainDiv);

      this.background = this.element.css('background-color') || "white";
      this.isIE7;
      /*@cc_on this.isIE = true; @*/
      if (this.isIE)
        this.background = "white";

      // Precalculate MD5 of sentence.
      assert(this.sentenceDescType == "md5" || this.sentenceDescType == "literal", "Bad value for 'sentenceDescType' option of DashedSentence.");
      if (this.sentenceDescType == "md5") {
        var canonicalSentence = this.words.join(' ');
        this.sentenceDesc = hex_md5(canonicalSentence);
      }
      else {
        if (typeof(this.options.s) === "string")
          this.sentenceDesc = csv_url_encode(this.options.s);
        else
          this.sentenceDesc = csv_url_encode(this.options.s.join(' '));
      }

      this.mainDiv.addClass(this.cssPrefix + "sentence");

      this.resultsLines = [];
      // Don't want to be allocating arrays in time-critical code.
      this.sprResults = [];
      for (var i = 0; i < this.words.length; ++i)
        this.sprResults[i] = new Array(2);
      this.previousTime = null;

      prepareDashedSentence.apply(this);

      const safeBind = this.safeBind;
      this.safeBind($(document), 'keydown', (event) => {
        // skip first space bar, only then register paging event listener
        if (event.keyCode === 32) {
          $(document).unbind('keydown');
          safeBind($(document), 'keydown', onKeyDown(this));
        }
      });

        // For iPhone/iPod touch -- add button for going to next word.
        if (isIPhone) {
          var btext = dget(this.options, "iPhoneNextButtonText", "next");
          var next = $("<div>")
              .addClass(this.cssPrefix + "iphone-next")
              .text(btext);
          this.element.append(next);
          next.click(function () {
            var time = new Date().getTime();

            // *** goToNext() ***
            //t.recordSprResult(time, t.currentWord);
            var word = t.currentWord;
            if (word > 0 && word < t.stoppingPoint) {
              var rs = t.sprResults[word-1];
              rs[0] = time;
              rs[1] = t.previousTime;
            }
            t.previousTime = time;

            if (t.currentWord - 1 >= 0)
              t.blankWord(t.currentWord - 1);
            if (t.currentWord < t.stoppingPoint)
              t.showWord(t.currentWord);
            ++(t.currentWord);
            if (t.currentWord > t.stoppingPoint) {
              t.processSprResults();
              t.finishedCallback(t.resultsLines);
            }

            return false;
            // ***
          });
        }

    },

    // Not using JQuery in these two methods just in case it slows things down too much.
    // NOTE: [0] subscript gets DOM object from JQuery selector.
    blankWord: function(w) {
      if (this.currentWord <= this.stoppingPoint) {
        this.owsnjq[w].style.borderColor = this.unshownBorderColor;
        this.iwsnjq[w].style.visibility = "hidden";
        if (! this.showBehind)
          this.owsnjq[w].style.borderColor = this.background;
      }
    },
    showWord: function(w) {
      if (this.currentWord < this.stoppingPoint) {
        if (this.showAhead || this.showBehind)
          this.owsnjq[w].style.borderColor = this.shownBorderColor;
        this.iwsnjq[w].style.visibility = "visible";
      }
    },

    processSprResults: function () {
      var nonSpaceWords = [];
      for (var i = 0; i < this.words.length; ++i) {
        if ( this.words[i] != "\r" )
          nonSpaceWords.push(this.words[i]);
      }

      for (var i = 0; i < nonSpaceWords.length; ++i) {
        this.resultsLines.push([
          ["Word number", i+1],
          ["Word", csv_url_encode(nonSpaceWords[i])],
          ["Reading time", this.sprResults[i][0] - this.sprResults[i][1]],
          ["Newline?",
           boolToInt(((i+1) < this.wordOSpans.length) &&
                     (this.wordOSpans[i].offset().top != this.wordOSpans[i+1].offset().top))],
          ["Sentence (or sentence MD5)", this.sentenceDesc]
        ]);
      }
    }
  },

  properties: {
    obligatory: ["s"],
    htmlDescription: function (opts) {
      return $(document.createElement("div")).text(opts.s);
    }
  }
});
