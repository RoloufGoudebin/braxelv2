import { Component, AfterViewInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent {
  service;
  public reviews = [];
  show = false;
  public innerWidth: any;

  constructor() { }

  slides: any = [[]];

  cards= [
    {
      'author_name': "Eric Cloquette",
      'rating': 5,
      'text': "Nous avons eu l'occasion de tester plusieurs agents immobiliers dans ces 30 dernières années.Soit le prix de vente annoncé pour votre bien est trop attractif pour vous faire signer le contrat, soit il est trop bas pour que la vente se fasse rapidement mais, souvent, à votre détriment....Braxel dispose d'un avantage majeur sur la concurrence : il connaît le marché parfaitement et utilise une méthode de valorisation qui lui est propre et qui est fort efficace. Avec cette méthode, vous déterminez le 'juste prix' rapidement. Ajoutez à cela un service pro, une équipe efficace/disponible et des honoraires au niveau de la concurrence... Dès lors, pourquoi hésiter?",
      "relative_time_description": "il y a deux mois"
    },
    {
      'author_name': "José Maia",
      'rating': 5,
      'text': "Plusieurs bonnes expériences avec cette agence qui est certainement une des plus qualitatives de par leur technicité mais aussi et surtout par leurs qualités humaines qui se reflète par leur volonté de satisfaire et accompagner le vendeur ET l'acheteur. Encore merci à Mr Chevalier pour la vente de mon bien en 1 jour! Mes amitiés à toute l'équipe;-)",
      "relative_time_description": "il y a un mois"
    },
    {
      'author_name': "olivia ketelbant",
      'rating': 5,
      'text': "J'ai contacté Edouard car une connaissance m'en avait parlé. Il a fait un travail très précis, efficace et professionnel. La vente s'est faite ultra rapidement. Le suivi a été précis. Agence fiable. Donne d'excellents conseils. Vise juste quant au prix . Contact super agréable et bien sympathique.",
      "relative_time_description": "il y a deux mois"
    },
    {
      'author_name': "Pierre Hendrickx",
      'rating': 5,
      'text': "Une équipe professionnelle , réactive et qui respecte ses engagements.",
      "relative_time_description": "il y a une semaine"
    },
    {
      'author_name': "François Van Santen",
      'rating': 5,
      'text': "Notre recherche immobilière était inscrite chez Braxel et en un mois, ils nous ont trouvé la maison idéale. Nous sommes non seulement ravis de notre acquisition mais aussi du service de l'agence : honnêteté, conseil technique, suivi du dossier de A à Z et grande amabilité! Agence prenant soin et mettant en confiance les acquéreurs. Je les recommande fortement.",
      "relative_time_description": "il y a trois mois"
    },
    {
      'author_name': "Thomas Micheli",
      'rating': 5,
      'text': "Très bonne agence, proche du client.",
      "relative_time_description": "il y a deux semaines"
    },{
      'author_name': "Fabienne Walravens",
      'rating': 5,
      'text': "Une disponibilité sans faille, un suivi de dossier impeccable, proactif (les documents nécessaires à la vente de notre appartement étaient prêts dès sa mise sur le marché), réseau fiable, très bon reportage photographique qui met le bien en valeur. Honnêteté, très bonne et réaliste évaluation du bien ! Présent de bout en bout, du premier contact à la signature de l'acte, Jovial, dynamique, efficace et de bon conseil,  Monsieur Baets nous a aidé à passer le cap difficile d'une vente en une vitesse éclair et dans le respect de ses engagements de départ! Merci de tout cœur, C'est l'agence immobilière qui sort du lot! A taille humaine, c'est le top!",
      "relative_time_description": "il y a deux mois"
    },
    {
      'author_name': "Nadine Nadinouchet",
      'rating': 5,
      'text': "Je remercie personnellement monsieur Édouard CHEVALIER pour son professionnalisme, sa disponibilité et ses bons conseils du début jusqu'à la fin.",
      "relative_time_description": "il y a un mois"
    },
    {
      'author_name': "Pierre Collinet",
      'rating': 5,
      'text': "Je collabore avec Braxel depuis plusieurs années. Ils sont pros, efficaces, disponibles,... et n'hésite pas à faire l'extra mile pour nous simplifier la vie au maximum. Pour rien au monde, je ne changerais d'agence :-)",
      "relative_time_description": "il y a un mois"
    },
    {
      'author_name': "B GRSMN",
      'rating': 5,
      'text': "Très réactif et très bon suivi. Grâce à cela mon commerce à pu voir le jour  Place communal à Ohain :-)",
      "relative_time_description": "il y a trois semaines"
    },
    {
      'author_name': "Séverine Hermand",
      'rating': 5,
      'text': "J'ai acheté mon appartement via l'agence Braxel en septembre. Le professionnalisme, la réactivité, la transparence et l'écoute dont a fait preuve Monsieur Thomas Offergeld tout au long de la transaction m'a permis d'acquérir mon bien immobilier dans des conditions idéales. Tout s'est déroulé parfaitement du début à la fin. Je remercie l'agence Braxel et tout particulièrement Thomas de m'avoir accompagné dans ce projet.  Je recommande fortement les services de l'agence Braxel vers qui je ferai sans aucun doute appel à l'avenir! Bravo pour votre travail, merci pour votre sérieux et votre efficacité!",
      "relative_time_description": "il y a un mois"
    },
    {
      'author_name': "Pierre Kutzner",
      'rating': 5,
      'text': "C'est en tant qu'acheteur que j'ai eu le plaisir de rencontrer M. E. Chevalier, co-gérant de l'agence Braxel, chargé de la vente d'un appartement que je souhaitais acquérir. Bien qu'avant tout au service de ses clients, j'ai pu apprécier le grand professionnalisme de M. Chevalier et sa courtoisie dans le suivi parfait de cette vente/achat. Si je devais réaliser une transaction immobilière je n'hésiterais pas à faire appel à l'agence Braxel !",
      "relative_time_description": "il y a deux mois"
    },
    {
      'author_name': "hannan el abbadi",
      'rating': 5,
      'text': "Nous avons rencontré Thomas et il a su directement répondre à nos besoins. Gentil, serviable et professionnel. Nous vous le recommandons. Hannan et Stephane",
      "relative_time_description": "il y a un mois"
    },
    {
      'author_name': "Anne Lang",
      'rating': 5,
      'text': "L'agence me fut recommandée par un proche. La qualité des services de Monsieur Chevalier fut au-dessus de nos espérances. Ecoute, efficacité, professionalisme, et excellent suivi d'un dossier assez compliqué jusqu'à la signature chez le notaire.",
      "relative_time_description": "il y a trois mois"
    },
  ];

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.slides = this.chunk(this.cards, 3);
  }

  /**
  ngAfterViewInit() {
    const request = {
      placeId: "ChIJIxgLPcrRw0cREMNq7b82f-0",
      fields: ['reviews']
    };
    this.service = new google.maps.places.PlacesService(document.getElementById('googleReviews'));

    this.service.getDetails(request, this.callback);
  }

  public callback = (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.reviews = place.reviews.slice();
      console.log(this.slides);
      if (this.innerWidth > 1000) {
        this.slides = this.chunk(this.reviews, 3);
      }
      if (this.innerWidth > 600 && this.innerWidth < 1000) {
        this.slides = this.chunk(this.reviews, 2);
      }

      if (this.innerWidth < 600 && this.innerWidth < 1000) {
        this.slides = this.chunk(this.reviews, 1);
      }
    }
  };**/

  createRange(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  isReviews() {
    if (this.reviews.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
}

