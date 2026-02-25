
const avatartypes =['thumbs', 'adventurer-neutral', 'fun-emoji', 'bottts-neutral','big-ears-neutral','avataaars-neutral'];
const avatarcharacters = ['Felix', 'Charlie', 'Max', 'Buddy', 'Rocky', 'Jack', 'Sophie', 'Luna', 'Lucy', 'Oscar', 'Milo', 'Simba', 'Zoe', 'Aneka', 'Rex', 'Nala', 'Toby', 'Coco', 'Daisy', 'Maggie', 'Bailey','Wyatt','Nolan','Valentina','Jasper','Ruby','Leo','Stella','Finn','Mia','Gizmo','Lily'];

let avatarlinks = [];
avatartypes.forEach(type => {
    avatarcharacters.forEach(character => {
        avatarlinks.push(`https://api.dicebear.com/9.x/${type}/svg?seed=${character}`);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const avatarContainer = document.getElementById('avatarsetion');
    avatarlinks.forEach(link => {
        const img = document.createElement('img');
        img.src = link;
        img.classList.add('avatar-picture');
        img.addEventListener('click', function() {
            document.getElementById('profilePic').src = link;
                document.querySelectorAll(".sidebar-avatar img, .dropdown-user-info img")
                .forEach((img) => {
                    img.src = link;
                });
            document.getElementById('changePictureModal').style.display = 'none';
        });
        avatarContainer.appendChild(img);
    });
});

function closeChangePictureModal(){
    document.getElementById('changePictureModal').style.display = 'none';
}
