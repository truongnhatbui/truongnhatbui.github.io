window.onload = function() {

    var messagesEl = document.querySelector('.messages');
    var typingSpeed = 20;
    var loadingText = '<b>•</b><b>•</b><b>•</b>';
    var messageIndex = 0;
  
    var getCurrentTime = function() {
      var date = new Date();
      var hours =  date.getHours();
      var minutes =  date.getMinutes();
      var current = hours + (minutes * .01);
      if (current >= 5 && current < 19) return 'Have a nice day';
      if (current >= 19 && current < 22) return 'Have a nice evening';
      if (current >= 22 || current < 5) return 'Have a good night';
    }
  
    var messages = [
      'Hi there 👋🏻',
      'I\'m Truong, an Analyst. Advisor. Architect',
      'I am passionate about the opportunities resulting from the convergence of Artificial Intelligence (AI), Machine Learning (ML), Digital Innovation, Digital Transformation and Modern Infrastructure.',
      'LinkedIn: <a target="_blank" href="https://www.linkedin.com/in/truongbui?utm_source=truongbui.com&utm_medium=website&utm_campaign=website_to_social&utm_term=linkedin&utm_content=textlink">Follow me on LinkedIn</a>',
      'Twitter: <a target="_blank" href="https://twitter.com/truongbui?utm_source=truongbui.com&utm_medium=website&utm_campaign=website_to_social&utm_term=twitter&utm_content=textlink">Follow me on Twitter</a>',
      'GitHub: <a target="_blank" href="https://bit.ly/3hziciS">GitHub</a>',
      'Azure DevOps: <a target="_blank" href="https://bit.ly/3ediHgu">Azure DevOps</a>',
      'Ideas & Feedback: <a target="_blank" href="https://feedback.userreport.com/ae473b9e-528e-433b-82c6-1786e95dd291/?utm_source=truongbui.com&utm_medium=website&utm_campaign=website_to_social&utm_term=userreport&utm_content=textlink">Give me any ideas & feedback</a>',
      'Please contact me if you require direct support 👉🏻 <a href="mailto:truongbn@gmail.com">send me a message</a>',
      'Truong (he/his/him)'
    ]
  
    var getFontSize = function() {
      return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
    }
  
    var pxToRem = function(px) {
      return px / getFontSize() + 'rem';
    }
  
    var createBubbleElements = function(message, position) {
      var bubbleEl = document.createElement('div');
      var messageEl = document.createElement('span');
      var loadingEl = document.createElement('span');
      bubbleEl.classList.add('bubble');
      bubbleEl.classList.add('is-loading');
      bubbleEl.classList.add('cornered');
      bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
      messageEl.classList.add('message');
      loadingEl.classList.add('loading');
      messageEl.innerHTML = message;
      loadingEl.innerHTML = loadingText;
      bubbleEl.appendChild(loadingEl);
      bubbleEl.appendChild(messageEl);
      bubbleEl.style.opacity = 0;
      return {
        bubble: bubbleEl,
        message: messageEl,
        loading: loadingEl
      }
    }
  
    var getDimentions = function(elements) {
      return dimensions = {
        loading: {
          w: '4rem',
          h: '2.25rem'
        },
        bubble: {
          w: pxToRem(elements.bubble.offsetWidth + 4),
          h: pxToRem(elements.bubble.offsetHeight)
        },
        message: {
          w: pxToRem(elements.message.offsetWidth + 4),
          h: pxToRem(elements.message.offsetHeight)
        }
      }
    }
  
    var sendMessage = function(message, position) {
      var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
      var elements = createBubbleElements(message, position);
      messagesEl.appendChild(elements.bubble);
      messagesEl.appendChild(document.createElement('br'));
      var dimensions = getDimentions(elements);
      elements.bubble.style.width = '0rem';
      elements.bubble.style.height = dimensions.loading.h;
      elements.message.style.width = dimensions.message.w;
      elements.message.style.height = dimensions.message.h;
      elements.bubble.style.opacity = 1;
      var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
      if (bubbleOffset > messagesEl.offsetHeight) {
        var scrollMessages = anime({
          targets: messagesEl,
          scrollTop: bubbleOffset,
          duration: 750
        });
      }
      var bubbleSize = anime({
        targets: elements.bubble,
        width: ['0rem', dimensions.loading.w],
        marginTop: ['2.5rem', 0],
        marginLeft: ['-2.5rem', 0],
        duration: 800,
        easing: 'easeOutElastic'
      });
      var loadingLoop = anime({
        targets: elements.bubble,
        scale: [1.05, .95],
        duration: 1100,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad'
      });
      var dotsStart = anime({
        targets: elements.loading,
        translateX: ['-2rem', '0rem'],
        scale: [.5, 1],
        duration: 400,
        delay: 25,
        easing: 'easeOutElastic',
      });
      var dotsPulse = anime({
        targets: elements.bubble.querySelectorAll('b'),
        scale: [1, 1.25],
        opacity: [.5, 1],
        duration: 300,
        loop: true,
        direction: 'alternate',
        delay: function(i) {return (i * 100) + 50}
      });
      setTimeout(function() {
        loadingLoop.pause();
        dotsPulse.restart({
          opacity: 0,
          scale: 0,
          loop: false,
          direction: 'forwards',
          update: function(a) {
            if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
              elements.bubble.classList.remove('is-loading');
              anime({
                targets: elements.message,
                opacity: [0, 1],
                duration: 300,
              });
            }
          }
        });
        bubbleSize.restart({
          scale: 1,
          width: [dimensions.loading.w, dimensions.bubble.w ],
          height: [dimensions.loading.h, dimensions.bubble.h ],
          marginTop: 0,
          marginLeft: 0,
          begin: function() {
            if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
          }
        })
      }, loadingDuration - 50);
    }
  
    var sendMessages = function() {
      var message = messages[messageIndex];
      if (!message) return;
      sendMessage(message);
      ++messageIndex;
      setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
    }
  
    sendMessages();
  
  }
  