export function parseRequestURL () {
  let url = location.hash.slice(1).toLowerCase() || '/';
  let r = url.split("/")
  let request = {
      resource : null,
      id : null,
      verb : null
  }
  request.resource = r[1]
  request.id = r[2]
  request.verb = r[3]

  return request
}

export function renderSpecialMeme(meme) {
  const view = document.createElement('article');
  view.className += 'meme';
  view.id = 'daymeme'
  view.innerHTML = /*html*/`
      <div class="meme-head">
          <h1 class="meme-name">${meme.name}</h1>
      </div>
      <p class="meme-text">${meme.description}</p>`;
  return view;
}

export function renderMeme(meme) {
    const view = document.createElement('article');
    view.className += 'meme';
    view.innerHTML = /*html*/`
        <div class="meme-head">
            <h1 class="meme-name">${meme.name}</h1>
            <button class="report-button" data-attr="${meme.id}" type="submit" id="report_${meme.id}"></button>
        </div>
        <p class="meme-text">${meme.description}</p>
        <pre>${meme.picture}</pre>
        <div class="vote-buttons">
            <button class="like" data-attr="${meme.id}" type="submit" id="like_${meme.id}"></button>
            <p class="rating" id="rating_${meme.id}">${meme.rating}</p>
            <button class="dislike" data-attr="${meme.id}" type="submit" id="dislike_${meme.id}"></button>
        </div>`;
    return view;
}

export function like(memeId) {
  firebase.auth().onAuthStateChanged(function(currentUser) {
      if (currentUser) {
        var ref = firebase.app().database().ref();
        return ref.child('memes/' + memeId).once('value').then(function (snapshot) {
            var rating = snapshot.val().rating;
            var liked = snapshot.val().liked;
            var disliked = snapshot.val().disliked;

            if (liked.indexOf(currentUser.email) > -1) {
              document.getElementById("like_" + memeId).classList.remove("clicked");
              rating -= 1;
              liked.splice(liked.indexOf(currentUser.email), 1);
            } else {
              liked.push(currentUser.email);

              if (disliked.indexOf(currentUser.email) > -1) {
                rating += 1;
                document.getElementById("dislike_" + memeId).classList.remove("clicked");
                disliked.splice(disliked.indexOf(currentUser.email), 1);
              }
              rating += 1;
              document.getElementById("like_" + memeId).classList.add("clicked");
            }

            
            document.getElementById("rating_" + memeId).innerText = rating.toString();
            return ref.child('memes/' + memeId).update({rating: rating, liked: liked, disliked: disliked});
        
          });
      } else {
        alert("LOG IN FIRST!");
        window.location.href = '/#/login';
      }
  });
}

export function dislike(memeId) {
  firebase.auth().onAuthStateChanged(function(currentUser) {
      if (currentUser) {
        var ref = firebase.app().database().ref();

        return ref.child('memes/' + memeId).once('value').then(function (snapshot) {
          var rating = snapshot.val().rating;
          var liked = snapshot.val().liked;
          var disliked = snapshot.val().disliked;

          if (disliked.indexOf(currentUser.email) > -1) {
            document.getElementById("dislike_" + memeId).classList.remove("clicked");
            rating += 1;
            disliked.splice(liked.indexOf(currentUser.email), 1);
          } else {
            disliked.push(currentUser.email);

            if (liked.indexOf(currentUser.email) > -1) {
              rating -= 1;
              document.getElementById("like_" + memeId).classList.remove("clicked");
              liked.splice(disliked.indexOf(currentUser.email), 1);
            }
            rating -= 1;
            document.getElementById("dislike_" + memeId).classList.add("clicked");
          }

          
          document.getElementById("rating_" + memeId).innerText = rating.toString();
          return ref.child('memes/' + memeId).update({rating: rating, liked: liked, disliked: disliked});
      
        });
      } else {
        alert("LOG IN FIRST!");
        window.location.href = '/#/login';
      }
  });
}
  
export function report(memeId) {
    firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {
            var ref = firebase.app().database().ref();
            ref.child('reports/' + memeId + "_from_" + currentUser.email.replace(/\./g, '_')).set({
                meme: memeId,
                author: currentUser.email.replace(/\./g, '_')
            });
            alert("MEME REPORTED! THE VIOLENT WILL BE PUNISHED!")
        }
        else {
          alert("LOG IN FIRST!");
          window.location.href = '/#/login';
        }
    });
}

export function getMemes(query) {
  return query.once('value')
      .then(function (snapshot) {
          var meme = [];
          snapshot.forEach(function (child) {
              meme.push({
                  id: child.ref.getKey(),
                  name: child.val().name,
                  author: child.val().author,
                  picture: child.val().picture,
                  description: child.val().description,
                  rating: child.val().rating,
                  liked: child.val().liked,
                  disliked: child.val().disliked,
                  timestamp: child.val().timestamp
              });
          });
          return Promise.resolve(meme);
      });
}

export function getCurrentAuthState() {
    return new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                resolve(user.email);
            } else {
                reject(Error('AUTH FAILED'));
            }
        });
    });
}