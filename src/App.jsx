import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import coachHero from "./assets/images/hicham-hero-v2.jpg";
import coachHeroAlt from "./assets/images/image hci.jpeg";
import transfo1 from "./assets/transfo-1.svg";
import transfo2 from "./assets/transfo-2.svg";
import transfo3 from "./assets/transfo-3.svg";
import coachingIlage from "./assets/certifications/coaching-ilage.jpg";
import ifbbDiploma from "./assets/certifications/diplome-ifbb.jpeg";
import ifbbCard from "./assets/certifications/carte-ifbb.jpeg";
import mmImage from "./assets/certifications/mm.jpg";
import hmLogo from "./assets/images/logo-trident.png";
import noAppointmentsGif from "./assets/images/no-appointments.gif";
import exercisesFrData from "./assets/exercises-fr.json";

const COACH_DISPLAY_NAME = "Hicham Mechekour";

const portfolioData = {
  fr: {
    nav: {
      coachLabel: "Réveille ton instinct sportif",
      services: "Services",
      certifications: "Certifications",
      experiences: "Experiences",
      results: "Resultats",
      contact: "Contact",
      reserve: "Reserver",
      viewCv: "Consulter CV",
      downloadCv: "Telecharger CV"
    },
    controls: {
      lightMode: "Clair",
      darkMode: "Nuit"
    },
    hero: {
      chip: "Coaching premium",
      line1: "Transforme ton corps.",
      line2: "Garde des resultats durables.",
      description:
        "J'aide les personnes actives a perdre du gras, gagner en energie et retrouver confiance grace a un coaching structure, humain et oriente resultats.",
      primaryCta: "Écrivez votre avis",
      secondaryCta: "Voir les transformations",
      downloadCvCta: "Telecharger le CV"
    },
    stats: [
      { value: "12 ans", labelLines: ["D'EXPERIENCE"] },
      { value: "+50", labelLines: ["CLIENTS", "ACCOMPAGNES"] },
      { value: "4.9/5", labelLines: ["SATISFACTION", "MOYENNE"] }
    ],
    servicesSection: {
      chip: "Accompagnement",
      title: "Services",
      subtitle: "Une methode claire pour progresser rapidement sans regime extreme ni entrainement inutile."
    },
    services: [
      {
        title: "Coaching personnalise",
        description: "Programme d'entrainement adapte a votre morphologie. Analyse morpho-anatomique.",
        icon: "01"
      },
      {
        title: "Nutrition",
        description: "Nutrition sportive et therapeutique avec un suivi personnalise.",
        icon: "02"
      },
      {
        title: "Suivi continu",
        description:
          "Suivi continu avec ajustements strategiques, bilans reguliers et accompagnement motive vers des resultats significatifs.",
        icon: "03"
      }
    ],
    certificationsSection: {
      chip: "Formation",
      title: "Diplomes et Certifications",
      subtitle: "Des certifications solides pour garantir un accompagnement professionnel et securise."
    },
    certifications: [
      {
        title: "Certificat d'entraineur personnel",
        organization: "IFBB Academy",
        dateLocation: "Juillet 2024, Tunisie",
        serial: "C / 52609",
        sliderImages: [ifbbDiploma, ifbbCard],
        imagePosition: "right",
        details: ["Certifie Personal Trainer avec accreditation IFBB.", "Numero de serie: C / 52609."]
      },
      {
        title: "Fitness et Bodybuilding Coach Diploma",
        organization: "BYB Training Company LTD",
        dateLocation: "Juin 2023, Batna (Algerie)",
        serial: "11005",
        image: coachingIlage,
        imagePosition: "left",
        details: [
          "Diplome de Fitness et Bodybuilding Coach par BYB Training Company LTD.",
          "Numero de serie: 11005."
        ]
      },
      {
        title: "Certificat en Communication Effective",
        organization: "Algerian Global Company for Training",
        dateLocation: "Juin 2023, Batna (Algerie)",
        image: mmImage,
        imagePosition: "right",
        details: [
          "Comprendre les besoins des clients et les orienter.",
          "Simplifier l'explication des exercices et techniques d'entrainement."
        ]
      }
    ],
    experiencesSection: {
      chip: "Parcours",
      title: "Experiences",
      subtitle: "Experience terrain en coaching, management de salle et competition sportive."
    },
    experiences: [
      {
        role: "Coach de Fitness et Bodybuilding",
        company: "Spartan Athletic Club",
        dateLocation: "Nov 2022 - Juil 2023, Seddouk (Algerie)",
        points: [
          "Coach de fitness et bodybuilding dans ma salle.",
          "Personnalisation des programmes d'entrainement et de nutrition."
        ]
      },
      {
        role: "Gerant de Salle de Sport",
        company: "Spartan Athletic Club",
        dateLocation: "Nov 2022 - Juil 2023, Seddouk (Algerie)",
        points: [
          "Management de toutes les sessions d'entrainement dans ma salle.",
          "Securite des clients et maintien des equipements et machines."
        ]
      },
      {
        role: "Athlete Competitif",
        company: "Competition regionale",
        dateLocation: "22 Fev 2022, Bejaia (Algerie)",
        points: ["Participation au championnat regional categorie Men's Physique."]
      },
      {
        role: "Coach en Salle de Sport",
        company: "Gym Bodysam",
        dateLocation: "Jan 2018 - Jan 2019, Seddouk (Algerie)",
        points: ["Coaching et orientation en Fitness et Bodybuilding."]
      }
    ],
    aboutSection: {
      chip: "Identite",
      title: "A propos",
      subtitle: "Une vision claire, une methode personnalisee et un accompagnement humain.",
      missionTitle: "Mission",
      missionText:
        "Je suis Hicham Mechekour, coach sportif certifie. Ma mission est de rendre le fitness accessible, efficace et durable pour chaque client.",
      approachTitle: "Approche",
      approachText:
        "Un plan d'entrainement intelligent, une nutrition flexible et une discipline progressive, ajustes selon ton niveau et ton mode de vie.",
      objectiveTitle: "Objectif",
      objectiveText:
        "Construire une progression stable, visible et durable grace a un suivi humain et des ajustements hebdomadaires."
    },
    resultsSection: {
      chip: "Transformation",
      title: "Resultats clients",
      subtitle: "Des progres concrets sur la perte de gras, la prise de muscle et la performance.",
      witnessPrefix: "Temoignage de"
    },
    results: [
      { name: "Yassine", detail: "-8kg en 12 semaines", image: transfo1 },
      { name: "Nadia", detail: "+4kg de masse musculaire", image: transfo2 },
      { name: "Karim", detail: "Semi-marathon termine", image: transfo3 }
    ],
    contact: {
      chip: "Passe a l'action",
      title: "Ecrivez votre avis",
      subtitle: "Mets une note et partage ton ressenti directement.",
      fields: {
        nom: "Nom",
        prenom: "Prenom",
        message: "Message",
        nomPlaceholder: "Votre nom",
        prenomPlaceholder: "Votre prenom",
        messagePlaceholder: "Partage ton experience avec le coaching, tes resultats ou ton ressenti."
      },
      ratingLabel: "Rating sur 5",
      ratingAction: "Donner",
      submit: "Partager mon avis",
      submitEdit: "Enregistrer la modification",
      reviewsTitle: "Avis des athletes",
      reviewsSubtitle: "",
      reviewAccountLabel: "Avis publie avec ton compte",
      reviewAccountRequired: "Compte requis",
      singleReviewNote: "Tu peux partager un seul avis. Ensuite, tu peux le modifier ou le supprimer depuis ta carte.",
      reviewEdit: "Modifier",
      reviewDelete: "Supprimer",
      viewMyReview: "Voir mon avis",
      reviewsPrevious: "Precedent",
      reviewsNext: "Suivant",
      socialTitle: "Reseaux et contact",
      backTop: "Revenir en haut",
      feedbackRequired: "Merci d'ajouter une note et ton commentaire.",
      feedbackLength: "Le commentaire doit contenir entre 10 et 200 caracteres.",
      feedbackSuccess: "Avis partagé avec succès.",
      feedbackEditSuccess: "Avis modifié avec succès.",
      feedbackDeleteSuccess: "Avis supprimé avec succès.",
      loginRequired: "Connecte-toi à ton compte pour partager ton avis",
      auth: {
        title: "Application Hicham-fit",
        subtitle: "Cree un compte ou connecte-toi pour acceder a ton espace",
        loginTab: "Connexion",
        registerTab: "Creer un compte",
        accessSpace: "Accéder à mon espace",
        accessAthleteSpace: "Accéder à mon espace athlète",
        firstName: "Prenom",
        lastName: "Nom",
        birthDate: "Date de naissance",
        sex: "Sexe",
        country: "Pays de residence",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        firstNamePlaceholder: "Votre prenom",
        lastNamePlaceholder: "Votre nom",
        birthDatePlaceholder: "Selectionner la date",
        sexPlaceholder: "Choisir le sexe",
        countryPlaceholder: "Choisir le pays de residence",
        sexOptions: {
          male: "Homme",
          female: "Femme"
        },
        signupSteps: {
          personal: "Informations personnelles",
          connection: "Informations de connexion",
          next: "Continuer",
          back: "Retour",
          complete: "Termine",
          active: "En cours",
          step: "Etape"
        },
        emailPlaceholder: "votre@email.com",
        passwordPlaceholder: "******",
        confirmPasswordPlaceholder: "Retapez le mot de passe",
        forgotPassword: "Mot de passe oublie ?",
        forgotPasswordInfo: "Code de reinitialisation envoye. Consulte ta boite mail puis saisis le code recu.",
        forgotPasswordFillEmail: "Entre ton adresse email pour recevoir le code de reinitialisation.",
        accountNotFound: "Ce compte n'existe pas avec cette adresse mail.",
        loginButton: "Se connecter",
        registerButton: "Creer mon compte",
        resetButton: "Mettre a jour le mot de passe",
        logoutButton: "Se deconnecter",
        resetCodeTab: "Code de verification",
        resetCodeSubtitle: "Saisis le code recu par email pour acceder a la reinitialisation de ton mot de passe.",
        resetCodeLabel: "Code recu par email",
        resetCodePlaceholder: "Exemple : A1b2C3",
        resetCodeButton: "Verifier le code",
        resetCodeCopied: "Code copie.",
        resetCodeCopyBlocked: "Le code est rempli. Si la copie est bloquee par le navigateur, selectionne-le manuellement.",
        resendCodeButton: "Renvoyer le code",
        resendCodeWait: "Tu pourras renvoyer un code dans",
        resetCodeRetryWait: "Un code est deja actif. Tu peux reessayer apres",
        resetCodeCountdown: "Code valide pendant",
        resetCodeRequired: "Entre le code recu dans ton email.",
        resetCodeInvalid: "Code invalide. Le code doit contenir exactement 6 caracteres alphanumeriques.",
        resetCodeExpired: "Le code de reinitialisation a expire. Clique sur Renvoyer le code.",
        resetTab: "Nouveau mot de passe",
        resetSubtitle: "Definis un nouveau mot de passe pour recuperer l'acces a ton compte.",
        resetExpiresNotice: "Cette page est valide pendant 3 minutes.",
        resetExpiresCountdown: "Temps restant",
        connectedAs: "Connecte en tant que",
        statusReady: "Compte actif dans l'application.",
        fillAll: "Merci de remplir tous les champs.",
        ageRestriction: "Vous devez avoir 18 ans ou plus pour utiliser cette application.",
        invalidEmail: "Adresse email invalide.",
        passwordShort: "Le mot de passe ne respecte pas encore toutes les conditions.",
        passwordRule: "Mot de passe securise : respecte toutes les conditions ci-dessous.",
        passwordStrongRequired: "Le mot de passe doit respecter toutes les conditions indiquees.",
        passwordRequirements: {
          minLength: "Au moins 12 caracteres",
          lowercase: "Au moins une lettre minuscule : a-z",
          uppercase: "Au moins une lettre majuscule : A-Z",
          digit: "Au moins un chiffre : 0-9",
          symbol: "Au moins un symbole autorise : ! @ # $ % & * _ - ? ."
        },
        passwordMismatch: "Les mots de passe ne correspondent pas.",
        userExists: "Un compte existe deja avec cette adresse mail.",
        invalidCredentials: "Email ou mot de passe incorrect.",
        networkError: "Le service ne répond pas pour le moment. Réessaie dans un instant.",
        emailNotConfirmed: "Confirme ton email via le lien recu, puis connecte-toi.",
        emailRateLimit: "Trop de tentatives. Attends 60 secondes puis reessaie.",
        confirmEmailRequired:
          "Activation email desactivee dans Supabase. Active Confirm email pour envoyer automatiquement le lien.",
        supabaseConfigMissing: "Configuration serveur manquante (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
        loginSuccess: "Connexion reussie.",
        registerSuccess: "Email de confirmation envoye. Clique sur le lien recu pour creer et activer ton compte.",
        signupConfirmInvalid: "Le lien de confirmation est invalide ou deja utilise.",
        signupConfirmExpired: "Le lien de confirmation a expire. Cree un nouveau compte.",
        resetSuccess: "Mot de passe mis a jour. Connecte-toi avec ton nouveau mot de passe.",
        logoutSuccess: "Vous etes deconnecte.",
        accountCreatedTitle: "Compte cree avec succes",
        accountCreatedSubtitle: "Ton email est confirme. Tu peux maintenant te connecter a ton espace.",
        accountCreatedAction: "Continuer",
        accountReadyLogin: "Vous pouvez acceder a votre espace personnel.",
        mailboxPromptTitle: "Consulte ta boite mail",
        mailboxPromptSubtitle: "Pour activer ton compte, confirme ton email depuis le lien recu.",
        resetMailboxSubtitle: "Pour reinitialiser ton mot de passe, consulte ton email puis saisis le code recu.",
        mailboxPromptAction: "Acceder a ma boite email",
        mailboxPromptBack: "Aller a la connexion",
        resetLinkInvalid: "Le lien de reinitialisation est invalide. Demande un nouveau lien.",
        resetLinkExpired: "Le lien de reinitialisation a expire. Demande un nouveau lien."
      },
      labels: {
        serial: "Serie",
        facebook: "Facebook",
        tiktok: "TikTok",
        instagram: "Instagram",
        whatsapp: "WhatsApp",
        email: "Email"
      }
    },
    sportsProfile: {
      title: "Completer mon profil sportif",
      subtitle: "Ces informations permettent de preparer un accompagnement adapte.",
      physicalTitle: "1. Informations physiques",
      sportTitle: "3. Informations sportives",
      supplementsTitle: "2. Complements alimentaires",
      healthTitle: "4. Blessures et informations medicales",
      required: "Obligatoire",
      optional: "Optionnel",
      heightCm: "Taille en cm",
      currentWeightKg: "Poids actuel en kg",
      sportPracticed: "Sport pratique",
      sportLevel: "Niveau sportif",
      sportGoal: "Objectif principal",
      sportGoalCustom: "Precise ton objectif",
      sessionsPerWeek: "Nombre de seances par semaine",
      noSport: "Aucun sport pratique",
      addSport: "Ajouter un sport",
      removeSport: "Supprimer",
      sportNumber: "Sport",
      noSupplement: "Aucun complement alimentaire",
      noInjury: "Aucune blessure",
      noMedicalInformation: "Aucune information medicale",
      supplementNumber: "Complement",
      addSupplement: "Ajouter un complement",
      removeSupplement: "Supprimer",
      supplementName: "Nom du complement",
      supplementDose: "Dose / Quantite",
      supplementUnit: "Unite",
      supplementFrequency: "Frequence",
      supplementTiming: "Moment de prise",
      supplementCategory: "Categorie",
      supplementStartDate: "Date de debut",
      supplementStatus: "Statut",
      supplementStatusHelp: {
        title: "Signification du statut",
        ongoing: "En cours : vous utilisez encore ce complement actuellement.",
        stopped: "Arrete : vous n'utilisez plus ce complement actuellement."
      },
      supplementCustomValue: "Precise",
      supplementRemark: "Remarque",
      supplementRemarkPlaceholder: "Exemple : a prendre avec de l’eau, apres le repas ...",
      injuries: "Blessures",
      injuryNumber: "Blessure",
      addInjury: "Ajouter une blessure",
      removeInjury: "Supprimer",
      injuryZone: "Zone concernee",
      injuryStartDate: "Date de debut",
      injuryStatus: "Statut",
      injuryStatusHelp: {
        title: "Signification du statut",
        ongoing: "En cours : la blessure est encore presente ou surveillee.",
        completed: "Termine : la blessure n'est plus active actuellement."
      },
      injuryRemark: "Remarque",
      injuryRemarkPlaceholder: "Exemple : douleur legere apres l’entrainement",
      medicalTitle: "Informations medicales",
      medicalNumber: "Probleme medical",
      addMedical: "Ajouter un probleme medical",
      removeMedical: "Supprimer",
      medicalProblemName: "Nom du probleme medical",
      medicalDescription: "Description",
      medicalStartDate: "Date de debut",
      medicalStatus: "Statut",
      medicalStatusHelp: {
        title: "Signification du statut",
        ongoing: "En cours : le probleme medical est encore present ou suivi.",
        completed: "Termine : le probleme medical n'est plus actif actuellement."
      },
      medicalRemark: "Remarque",
      medicalRemarkPlaceholder: "Exemple : je ressens parfois une gene pendant l’effort physique",
      remarks: "Remarques",
      save: "Enregistrer mon profil",
      saving: "Enregistrement...",
      success: "Profil sportif complete.",
      requiredError: "Merci de remplir toutes les informations obligatoires.",
      sessionExpired: "Connexion à actualiser. Reconnecte-toi pour compléter ton profil.",
      dashboardTitle: "Tableau de bord athlète",
      dashboardSubtitle: "Ton profil sportif est pret.",
      editProfile: "Modifier mon profil sportif",
      logout: "Se deconnecter",
      levelOptions: {
        beginner: "Debutant",
        intermediate: "Intermediaire",
        advanced: "Avance"
      },
      goalOptions: {
        weight_loss: "Perte de poids",
        fat_loss_cut: "Perte de gras / Seche",
        muscle_hypertrophy: "Hypertrophie musculaire",
        vascular_hypertrophy: "Hypertrophie vasculaire",
        mobility: "Mobilite",
        strength: "Force musculaire",
        body_recomposition: "Recomposition corporelle / metabolique",
        other: "Autre"
      }
    },
    footer: {
      rights: "Tous les droits sont reserves - Hicham Mechekour"
    }
  },
  en: {
    nav: {
      coachLabel: "Awaken your athletic instinct",
      services: "Services",
      certifications: "Certifications",
      experiences: "Experience",
      results: "Results",
      contact: "Contact",
      reserve: "Book",
      viewCv: "View CV",
      downloadCv: "Download CV"
    },
    controls: {
      lightMode: "Light",
      darkMode: "Night"
    },
    hero: {
      chip: "Premium coaching",
      line1: "Transform your body.",
      line2: "Keep long-term results.",
      description:
        "I help active people lose fat, build energy, and regain confidence through structured, human coaching focused on real outcomes.",
      primaryCta: "Write your review",
      secondaryCta: "See transformations",
      downloadCvCta: "Download CV"
    },
    stats: [
      { value: "12 years", labelLines: ["OF EXPERIENCE"] },
      { value: "+50", labelLines: ["CLIENTS", "COACHED"] },
      { value: "4.9/5", labelLines: ["AVERAGE", "RATING"] }
    ],
    servicesSection: {
      chip: "Support",
      title: "Services",
      subtitle: "A clear method to progress fast without extreme diets or useless training."
    },
    services: [
      {
        title: "Personal coaching",
        description: "Training program adapted to your morphology. Morpho-anatomical analysis.",
        icon: "01"
      },
      {
        title: "Nutrition",
        description: "Sports and therapeutic nutrition with personalized follow-up.",
        icon: "02"
      },
      {
        title: "Continuous follow-up",
        description: "Weekly adjustments, regular check-ins and motivation for significant results.",
        icon: "03"
      }
    ],
    certificationsSection: {
      chip: "Training",
      title: "Diplomas and Certifications",
      subtitle: "Strong certifications to guarantee professional and safe support."
    },
    certifications: [
      {
        title: "Personal Trainer Certificate",
        organization: "IFBB Academy",
        dateLocation: "July 2024, Tunisia",
        serial: "C / 52609",
        sliderImages: [ifbbDiploma, ifbbCard],
        imagePosition: "right",
        details: ["Certified Personal Trainer with IFBB accreditation.", "Serial number: C / 52609."]
      },
      {
        title: "Fitness and Bodybuilding Coach Diploma",
        organization: "BYB Training Company LTD",
        dateLocation: "June 2023, Batna (Algeria)",
        serial: "11005",
        image: coachingIlage,
        imagePosition: "left",
        details: [
          "Fitness and Bodybuilding Coach Diploma by BYB Training Company LTD.",
          "Serial number: 11005."
        ]
      },
      {
        title: "Effective Communication Certificate",
        organization: "Algerian Global Company for Training",
        dateLocation: "June 2023, Batna (Algeria)",
        image: mmImage,
        imagePosition: "right",
        details: [
          "Understand clients' needs and guide them clearly.",
          "Simplify exercise and training technique explanations."
        ]
      }
    ],
    experiencesSection: {
      chip: "Journey",
      title: "Experience",
      subtitle: "Field experience in coaching, gym management and competition."
    },
    experiences: [
      {
        role: "Fitness and Bodybuilding Coach",
        company: "Spartan Athletic Club",
        dateLocation: "Nov 2022 - Jul 2023, Seddouk (Algeria)",
        points: [
          "Fitness and bodybuilding coaching in my gym.",
          "Personalized training and nutrition plans."
        ]
      },
      {
        role: "Gym Manager",
        company: "Spartan Athletic Club",
        dateLocation: "Nov 2022 - Jul 2023, Seddouk (Algeria)",
        points: [
          "Managed all training sessions in my gym.",
          "Ensured client safety and equipment maintenance."
        ]
      },
      {
        role: "Competitive Athlete",
        company: "Regional competition",
        dateLocation: "22 Feb 2022, Bejaia (Algeria)",
        points: ["Participated in the regional Men's Physique championship."]
      },
      {
        role: "Gym Coach",
        company: "Gym Bodysam",
        dateLocation: "Jan 2018 - Jan 2019, Seddouk (Algeria)",
        points: ["Coaching and guidance in Fitness and Bodybuilding."]
      }
    ],
    aboutSection: {
      chip: "Identity",
      title: "About",
      subtitle: "A clear vision, a personalized method, and human support.",
      missionTitle: "Mission",
      missionText:
        "I am Hicham Mechekour, a certified fitness coach. My mission is to make fitness accessible, effective, and sustainable for every client.",
      approachTitle: "Approach",
      approachText:
        "Smart training, flexible nutrition, and progressive discipline, adapted to your level and your lifestyle.",
      objectiveTitle: "Objective",
      objectiveText:
        "Build stable, visible, and lasting progress with human follow-up and weekly adjustments."
    },
    resultsSection: {
      chip: "Transformation",
      title: "Client results",
      subtitle: "Concrete progress in fat loss, muscle gain and performance.",
      witnessPrefix: "Testimonial from"
    },
    results: [
      { name: "Yassine", detail: "-8kg in 12 weeks", image: transfo1 },
      { name: "Nadia", detail: "+4kg muscle mass", image: transfo2 },
      { name: "Karim", detail: "Completed a half marathon", image: transfo3 }
    ],
    contact: {
      chip: "Take action",
      title: "Write your review",
      subtitle: "Add a rating and share your experience directly.",
      fields: {
        nom: "Last name",
        prenom: "First name",
        message: "Message",
        nomPlaceholder: "Your last name",
        prenomPlaceholder: "Your first name",
        messagePlaceholder: "Share your coaching experience, results, or feeling."
      },
      ratingLabel: "Rating out of 5",
      ratingAction: "Give",
      submit: "Share my review",
      submitEdit: "Save change",
      reviewsTitle: "Athlete reviews",
      reviewsSubtitle: "",
      reviewAccountLabel: "Review published with your account",
      reviewAccountRequired: "Account required",
      singleReviewNote: "You can share one review only. After that, you can edit or delete it from your card.",
      reviewEdit: "Edit",
      reviewDelete: "Delete",
      viewMyReview: "View my review",
      reviewsPrevious: "Previous",
      reviewsNext: "Next",
      socialTitle: "Networks and contact",
      backTop: "Back to top",
      feedbackRequired: "Please add a rating and your message.",
      feedbackLength: "The comment must contain between 10 and 200 characters.",
      feedbackSuccess: "Review published successfully.",
      feedbackEditSuccess: "Review updated successfully.",
      feedbackDeleteSuccess: "Review deleted successfully.",
      loginRequired: "Sign in or create an account to share your review.",
      auth: {
        title: "Hicham-fit App",
        subtitle: "Create an account or sign in to access your space.",
        loginTab: "Sign in",
        registerTab: "Create account",
        accessSpace: "Access my space",
        accessAthleteSpace: "Access my athlete space",
        firstName: "First name",
        lastName: "Last name",
        birthDate: "Birth date",
        sex: "Sex",
        country: "Country of residence",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        firstNamePlaceholder: "Your first name",
        lastNamePlaceholder: "Your last name",
        birthDatePlaceholder: "Select birth date",
        sexPlaceholder: "Select sex",
        countryPlaceholder: "Select country of residence",
        sexOptions: {
          male: "Male",
          female: "Female"
        },
        signupSteps: {
          personal: "Personal information",
          connection: "Login information",
          next: "Continue",
          back: "Back",
          complete: "Complete",
          active: "Current",
          step: "Step"
        },
        emailPlaceholder: "you@email.com",
        passwordPlaceholder: "******",
        confirmPasswordPlaceholder: "Type password again",
        forgotPassword: "Forgot password?",
        forgotPasswordInfo: "Password reset code sent. Check your mailbox and enter the code you received.",
        forgotPasswordFillEmail: "Enter your email address to receive the reset code.",
        accountNotFound: "No account exists with this email address.",
        loginButton: "Sign in",
        registerButton: "Create my account",
        resetButton: "Update password",
        logoutButton: "Log out",
        resetCodeTab: "Verification code",
        resetCodeSubtitle: "Enter the code sent by email to access the password reset page.",
        resetCodeLabel: "Code received by email",
        resetCodePlaceholder: "Example: A1b2C3",
        resetCodeButton: "Verify code",
        resetCodeCopied: "Code copied.",
        resetCodeCopyBlocked: "The code is filled in. If the browser blocks copying, select it manually.",
        resendCodeButton: "Resend code",
        resendCodeWait: "You can resend a code in",
        resetCodeRetryWait: "A code is already active. You can try again after",
        resetCodeCountdown: "Code valid for",
        resetCodeRequired: "Enter the code received in your email.",
        resetCodeInvalid: "Invalid code. The code must contain exactly 6 alphanumeric characters.",
        resetCodeExpired: "The reset code has expired. Click Resend code.",
        resetTab: "New password",
        resetSubtitle: "Set a new password to recover access to your account.",
        resetExpiresNotice: "This page stays valid for 3 minutes.",
        resetExpiresCountdown: "Time remaining",
        connectedAs: "Signed in as",
        statusReady: "Account active in the application.",
        fillAll: "Please fill in all fields.",
        ageRestriction: "You must be at least 18 years old to use this application.",
        invalidEmail: "Invalid email address.",
        passwordShort: "Password does not meet all requirements yet.",
        passwordRule: "Secure password: meet all the requirements below.",
        passwordStrongRequired: "Password must meet all listed requirements.",
        passwordRequirements: {
          minLength: "At least 12 characters",
          lowercase: "At least one lowercase letter: a-z",
          uppercase: "At least one uppercase letter: A-Z",
          digit: "At least one digit: 0-9",
          symbol: "At least one allowed symbol: ! @ # $ % & * _ - ? ."
        },
        passwordMismatch: "Passwords do not match.",
        userExists: "This email already exists.",
        invalidCredentials: "Incorrect email or password.",
        networkError: "Unable to reach the server. Check your connection and try again.",
        emailNotConfirmed: "Please confirm your email from the received link, then sign in.",
        emailRateLimit: "Too many attempts. Please wait 60 seconds and try again.",
        confirmEmailRequired:
          "Email activation is disabled in Supabase. Enable Confirm email to send the verification link automatically.",
        supabaseConfigMissing: "Server configuration missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
        loginSuccess: "Signed in successfully.",
        registerSuccess: "Confirmation email sent. Click the received link to create and activate your account.",
        signupConfirmInvalid: "This confirmation link is invalid or already used.",
        signupConfirmExpired: "This confirmation link has expired. Create a new account.",
        resetSuccess: "Password updated. Sign in with your new password.",
        logoutSuccess: "You are logged out.",
        accountCreatedTitle: "Account created successfully",
        accountCreatedSubtitle: "Your email is confirmed. You can now sign in to your space.",
        accountCreatedAction: "Continue",
        accountReadyLogin: "You can access your personal space.",
        mailboxPromptTitle: "Check your mailbox",
        mailboxPromptSubtitle: "To activate your account, confirm your email using the received link.",
        resetMailboxSubtitle: "To reset your password, check your mailbox and enter the code you received.",
        mailboxPromptAction: "Open my email inbox",
        mailboxPromptBack: "Go to sign in",
        resetLinkInvalid: "This reset link is invalid. Request a new one.",
        resetLinkExpired: "This reset link has expired. Request a new one."
      },
      labels: {
        serial: "Serial",
        facebook: "Facebook",
        tiktok: "TikTok",
        instagram: "Instagram",
        whatsapp: "WhatsApp",
        email: "Email"
      }
    },
    sportsProfile: {
      title: "Complete my sports profile",
      subtitle: "These details help prepare coaching adapted to you.",
      physicalTitle: "1. Physical information",
      sportTitle: "3. Sports information",
      supplementsTitle: "2. Dietary supplements",
      healthTitle: "4. Injuries and medical information",
      required: "Required",
      optional: "Optional",
      heightCm: "Height in cm",
      currentWeightKg: "Current weight in kg",
      sportPracticed: "Sport practiced",
      sportLevel: "Sports level",
      sportGoal: "Main goal",
      sportGoalCustom: "Specify your goal",
      sessionsPerWeek: "Sessions per week",
      noSport: "No sport practiced",
      addSport: "Add a sport",
      removeSport: "Remove",
      sportNumber: "Sport",
      noSupplement: "No dietary supplement",
      noInjury: "No injury",
      noMedicalInformation: "No medical information",
      supplementNumber: "Supplement",
      addSupplement: "Add a supplement",
      removeSupplement: "Remove",
      supplementName: "Supplement name",
      supplementDose: "Dose / Quantity",
      supplementUnit: "Unit",
      supplementFrequency: "Frequency",
      supplementTiming: "Time of intake",
      supplementCategory: "Category",
      supplementStartDate: "Start date",
      supplementStatus: "Status",
      supplementStatusHelp: {
        title: "Status meaning",
        ongoing: "Ongoing: you are still using this supplement.",
        stopped: "Stopped: you are not using this supplement anymore."
      },
      supplementCustomValue: "Specify",
      supplementRemark: "Remark",
      supplementRemarkPlaceholder: "Example: take with water, after the meal ...",
      injuries: "Injuries",
      injuryNumber: "Injury",
      addInjury: "Add an injury",
      removeInjury: "Remove",
      injuryZone: "Affected area",
      injuryStartDate: "Start date",
      injuryStatus: "Status",
      injuryStatusHelp: {
        title: "Status meaning",
        ongoing: "Ongoing: the injury is still present or monitored.",
        completed: "Completed: the injury is not active anymore."
      },
      injuryRemark: "Remark",
      injuryRemarkPlaceholder: "Example: mild pain after training",
      medicalTitle: "Medical information",
      medicalNumber: "Medical issue",
      addMedical: "Add a medical issue",
      removeMedical: "Remove",
      medicalProblemName: "Medical issue name",
      medicalDescription: "Description",
      medicalStartDate: "Start date",
      medicalStatus: "Status",
      medicalStatusHelp: {
        title: "Status meaning",
        ongoing: "Ongoing: the medical issue is still present or monitored.",
        completed: "Completed: the medical issue is not active anymore."
      },
      medicalRemark: "Remark",
      medicalRemarkPlaceholder: "Example: I sometimes feel discomfort during physical effort",
      remarks: "Remarks",
      save: "Save my profile",
      saving: "Saving...",
      success: "Sports profile completed.",
      requiredError: "Please fill in all required information.",
      sessionExpired: "Connection needs refreshing. Sign in again to complete your profile.",
      dashboardTitle: "Athlete dashboard",
      dashboardSubtitle: "Your sports profile is ready.",
      editProfile: "Edit my sports profile",
      logout: "Log out",
      levelOptions: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced"
      },
      goalOptions: {
        weight_loss: "Weight loss",
        fat_loss_cut: "Fat loss / Cut",
        muscle_hypertrophy: "Muscle hypertrophy",
        vascular_hypertrophy: "Vascular hypertrophy",
        mobility: "Mobility",
        strength: "Muscular strength",
        body_recomposition: "Body / metabolic recomposition",
        other: "Other"
      }
    },
    footer: {
      rights: "All rights reserved - Hicham Mechekour"
    }
  },
  ar: {
    nav: {
      coachLabel: "أيقظ غريزتك الرياضية",
      services: "الخدمات",
      certifications: "الشهادات",
      experiences: "الخبرات",
      results: "النتائج",
      contact: "التواصل",
      reserve: "احجز",
      viewCv: "عرض السيرة",
      downloadCv: "تحميل السيرة"
    },
    controls: {
      lightMode: "فاتح",
      darkMode: "ليلي"
    },
    hero: {
      chip: "تدريب مميز",
      line1: "غيّر جسمك.",
      line2: "واحافظ على نتائج دائمة.",
      description:
        "اساعد الاشخاص النشيطين على خسارة الدهون وزيادة الطاقة واسترجاع الثقة عبر تدريب منظم وانساني يركز على النتائج.",
      primaryCta: "اكتب رأيك",
      secondaryCta: "شاهد التحولات",
      downloadCvCta: "تحميل السيرة الذاتية"
    },
    stats: [
      { value: "12 سنة", labelLines: ["خبرة"] },
      { value: "+50", labelLines: ["عميل", "تمت مرافقتهم"] },
      { value: "4.9/5", labelLines: ["معدل", "الرضا"] }
    ],
    servicesSection: {
      chip: "المرافقة",
      title: "الخدمات",
      subtitle: "طريقة واضحة للتطور بسرعة بدون حمية قاسية او تمارين غير مفيدة."
    },
    services: [
      {
        title: "تدريب شخصي",
        description: "برنامج تدريبي مناسب لبنية جسمك مع تحليل مورفولوجي وتشريحي.",
        icon: "01"
      },
      {
        title: "التغذية",
        description: "تغذية رياضية وعلاجية مع متابعة شخصية مستمرة.",
        icon: "02"
      },
      {
        title: "متابعة مستمرة",
        description: "تعديلات اسبوعية وتقارير منتظمة وتحفيز دائم لنتائج واضحة.",
        icon: "03"
      }
    ],
    certificationsSection: {
      chip: "التكوين",
      title: "الدبلومات والشهادات",
      subtitle: "شهادات قوية لضمان مرافقة احترافية وآمنة."
    },
    certifications: [
      {
        title: "شهادة مدرب شخصي",
        organization: "IFBB Academy",
        dateLocation: "يوليو 2024، تونس",
        serial: "C / 52609",
        sliderImages: [ifbbDiploma, ifbbCard],
        imagePosition: "right",
        details: ["مدرب شخصي معتمد من IFBB.", "رقم السلسلة: C / 52609."]
      },
      {
        title: "دبلوم مدرب لياقة وكمال اجسام",
        organization: "BYB Training Company LTD",
        dateLocation: "يونيو 2023، باتنة (الجزائر)",
        serial: "11005",
        image: coachingIlage,
        imagePosition: "left",
        details: ["دبلوم تدريب لياقة وكمال اجسام من BYB Training Company LTD.", "رقم السلسلة: 11005."]
      },
      {
        title: "شهادة التواصل الفعال",
        organization: "Algerian Global Company for Training",
        dateLocation: "يونيو 2023، باتنة (الجزائر)",
        image: mmImage,
        imagePosition: "right",
        details: ["فهم احتياجات العملاء وتوجيههم بشكل صحيح.", "تبسيط شرح التمارين وتقنيات التدريب."]
      }
    ],
    experiencesSection: {
      chip: "المسار",
      title: "الخبرات",
      subtitle: "خبرة ميدانية في التدريب، تسيير القاعات والمنافسات الرياضية."
    },
    experiences: [
      {
        role: "مدرب لياقة وكمال اجسام",
        company: "Spartan Athletic Club",
        dateLocation: "نوفمبر 2022 - يوليو 2023، صدوق (الجزائر)",
        points: ["تدريب اللياقة وكمال الاجسام داخل القاعة.", "تخصيص برامج التدريب والتغذية لكل متدرب."]
      },
      {
        role: "مسير قاعة رياضية",
        company: "Spartan Athletic Club",
        dateLocation: "نوفمبر 2022 - يوليو 2023، صدوق (الجزائر)",
        points: ["تسيير جميع حصص التدريب داخل القاعة.", "ضمان سلامة العملاء وصيانة الاجهزة والمعدات."]
      },
      {
        role: "رياضي تنافسي",
        company: "منافسة جهوية",
        dateLocation: "22 فيفري 2022، بجاية (الجزائر)",
        points: ["المشاركة في البطولة الجهوية لفئة Men's Physique."]
      },
      {
        role: "مدرب في القاعة",
        company: "Gym Bodysam",
        dateLocation: "جانفي 2018 - جانفي 2019، صدوق (الجزائر)",
        points: ["تدريب وتوجيه في اللياقة وكمال الاجسام."]
      }
    ],
    aboutSection: {
      chip: "الهوية",
      title: "نبذة",
      subtitle: "رؤية واضحة، منهج شخصي، ومرافقة انسانية مستمرة.",
      missionTitle: "المهمة",
      missionText: "انا هشام مشكور، مدرب رياضي معتمد. مهمتي جعل اللياقة سهلة وفعالة ومستدامة لكل عميل.",
      approachTitle: "المنهج",
      approachText: "تدريب ذكي، تغذية مرنة، وانضباط تدريجي حسب مستواك ونمط حياتك.",
      objectiveTitle: "الهدف",
      objectiveText: "بناء تطور ثابت ومرئي ودائم عبر متابعة انسانية وتعديلات اسبوعية."
    },
    resultsSection: {
      chip: "التحول",
      title: "نتائج العملاء",
      subtitle: "تقدم حقيقي في خسارة الدهون، زيادة العضلات وتحسين الاداء.",
      witnessPrefix: "شهادة"
    },
    results: [
      { name: "ياسين", detail: "-8 كلغ خلال 12 اسبوع", image: transfo1 },
      { name: "نادية", detail: "+4 كلغ كتلة عضلية", image: transfo2 },
      { name: "كريم", detail: "اكمل نصف ماراثون", image: transfo3 }
    ],
    contact: {
      chip: "ابدأ الآن",
      title: "اكتب رأيك",
      subtitle: "ضع تقييما وشارك تجربتك مباشرة.",
      fields: {
        nom: "اللقب",
        prenom: "الاسم",
        message: "الرسالة",
        nomPlaceholder: "اكتب لقبك",
        prenomPlaceholder: "اكتب اسمك",
        messagePlaceholder: "شارك تجربتك مع التدريب او نتائجك او احساسك."
      },
      ratingLabel: "التقييم من 5",
      ratingAction: "اعطاء",
      submit: "مشاركة رأيي",
      submitEdit: "حفظ التعديل",
      reviewsTitle: "آراء الرياضيين",
      reviewsSubtitle: "",
      reviewAccountLabel: "ينشر الرأي بحسابك",
      reviewAccountRequired: "الحساب مطلوب",
      singleReviewNote: "يمكنك مشاركة رأي واحد فقط. بعد ذلك يمكنك تعديله او حذفه من بطاقتك.",
      reviewEdit: "تعديل",
      reviewDelete: "حذف",
      viewMyReview: "رؤية رأيي",
      reviewsPrevious: "السابق",
      reviewsNext: "التالي",
      socialTitle: "الشبكات والتواصل",
      backTop: "العودة للاعلى",
      feedbackRequired: "يرجى اضافة تقييم ورسالتك.",
      feedbackLength: "يجب ان يكون التعليق بين 10 و200 حرف.",
      feedbackSuccess: "تم نشر الرأي بنجاح.",
      feedbackEditSuccess: "تم تعديل الرأي بنجاح.",
      feedbackDeleteSuccess: "تم حذف الرأي بنجاح.",
      loginRequired: "سجل الدخول او انشئ حسابا لمشاركة رأيك.",
      auth: {
        title: "تطبيق Hicham-fit",
        subtitle: "انشئ حسابا او سجّل الدخول للوصول الى مساحتك.",
        loginTab: "تسجيل الدخول",
        registerTab: "انشاء حساب",
        accessSpace: "الدخول الى مساحتي",
        accessAthleteSpace: "الدخول الى مساحة الرياضي",
        firstName: "الاسم",
        lastName: "اللقب",
        birthDate: "تاريخ الميلاد",
        sex: "الجنس",
        country: "بلد الإقامة",
        email: "البريد الالكتروني",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        firstNamePlaceholder: "اكتب اسمك",
        lastNamePlaceholder: "اكتب لقبك",
        birthDatePlaceholder: "اختر تاريخ الميلاد",
        sexPlaceholder: "اختر الجنس",
        countryPlaceholder: "اختر بلد الإقامة",
        sexOptions: {
          male: "ذكر",
          female: "انثى"
        },
        signupSteps: {
          personal: "المعلومات الشخصية",
          connection: "معلومات الدخول",
          next: "متابعة",
          back: "رجوع",
          complete: "مكتمل",
          active: "جارية",
          step: "خطوة"
        },
        emailPlaceholder: "you@email.com",
        passwordPlaceholder: "******",
        confirmPasswordPlaceholder: "اعد كتابة كلمة المرور",
        forgotPassword: "نسيت كلمة المرور؟",
        forgotPasswordInfo: "تم ارسال رمز اعادة التعيين. افحص بريدك ثم اكتب الرمز الذي وصلك.",
        forgotPasswordFillEmail: "اكتب بريدك الالكتروني للحصول على رمز اعادة التعيين.",
        accountNotFound: "لا يوجد حساب بهذا البريد الالكتروني.",
        loginButton: "دخول",
        registerButton: "انشاء حسابي",
        resetButton: "تحديث كلمة المرور",
        logoutButton: "تسجيل الخروج",
        resetCodeTab: "رمز التحقق",
        resetCodeSubtitle: "اكتب الرمز الذي وصلك عبر البريد للوصول الى صفحة تغيير كلمة المرور.",
        resetCodeLabel: "الرمز المرسل عبر البريد",
        resetCodePlaceholder: "مثال: A1b2C3",
        resetCodeButton: "تحقق من الرمز",
        resetCodeCopied: "تم نسخ الرمز.",
        resetCodeCopyBlocked: "تم ملء الرمز. اذا منع المتصفح النسخ، حدده يدويا.",
        resendCodeButton: "اعادة ارسال الرمز",
        resendCodeWait: "يمكنك اعادة ارسال رمز خلال",
        resetCodeRetryWait: "يوجد رمز فعال حاليا. يمكنك المحاولة بعد",
        resetCodeCountdown: "صلاحية الرمز",
        resetCodeRequired: "اكتب الرمز الذي وصلك في البريد.",
        resetCodeInvalid: "الرمز غير صالح. يجب ان يحتوي على 6 احرف او ارقام بالضبط.",
        resetCodeExpired: "انتهت صلاحية رمز اعادة التعيين. اضغط على اعادة ارسال الرمز.",
        resetTab: "كلمة مرور جديدة",
        resetSubtitle: "حدد كلمة مرور جديدة لاستعادة الوصول الى حسابك.",
        resetExpiresNotice: "هذه الصفحة صالحة لمدة 3 دقائق.",
        resetExpiresCountdown: "الوقت المتبقي",
        connectedAs: "متصل باسم",
        statusReady: "الحساب مفعل داخل التطبيق.",
        fillAll: "يرجى ملء جميع الحقول.",
        ageRestriction: "يجب ان يكون عمرك 18 سنة او اكثر لاستخدام هذا التطبيق.",
        invalidEmail: "البريد الالكتروني غير صالح.",
        passwordShort: "كلمة المرور لا تحترم كل الشروط بعد.",
        passwordRule: "كلمة مرور قوية: يجب احترام كل الشروط التالية.",
        passwordStrongRequired: "كلمة المرور يجب ان تحترم كل الشروط المذكورة.",
        passwordRequirements: {
          minLength: "12 حرفا على الاقل",
          lowercase: "حرف صغير واحد على الاقل: a-z",
          uppercase: "حرف كبير واحد على الاقل: A-Z",
          digit: "رقم واحد على الاقل: 0-9",
          symbol: "رمز مسموح واحد على الاقل: ! @ # $ % & * _ - ? ."
        },
        passwordMismatch: "كلمتا المرور غير متطابقتين.",
        userExists: "هذا البريد موجود مسبقا.",
        invalidCredentials: "البريد او كلمة المرور غير صحيحة.",
        networkError: "تعذر الاتصال بالخادم. تحقق من اتصالك ثم حاول مرة اخرى.",
        emailNotConfirmed: "يرجى تأكيد بريدك عبر الرابط المرسل ثم تسجيل الدخول.",
        emailRateLimit: "محاولات كثيرة. انتظر 60 ثانية ثم حاول مرة اخرى.",
        confirmEmailRequired:
          "تفعيل البريد غير مفعل في Supabase. فعّل Confirm email لإرسال رابط التفعيل تلقائيا.",
        supabaseConfigMissing: "اعدادات الخادم ناقصة (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
        loginSuccess: "تم تسجيل الدخول بنجاح.",
        registerSuccess: "تم ارسال بريد التأكيد. اضغط على الرابط المرسل لانشاء وتفعيل حسابك.",
        signupConfirmInvalid: "رابط التأكيد غير صالح او تم استخدامه من قبل.",
        signupConfirmExpired: "انتهت صلاحية رابط التأكيد. انشئ حسابا جديدا.",
        resetSuccess: "تم تحديث كلمة المرور. سجل الدخول بكلمة المرور الجديدة.",
        logoutSuccess: "تم تسجيل الخروج.",
        accountCreatedTitle: "تم انشاء الحساب بنجاح",
        accountCreatedSubtitle: "تم تأكيد بريدك الالكتروني. يمكنك الآن تسجيل الدخول الى مساحتك.",
        accountCreatedAction: "متابعة",
        accountReadyLogin: "يمكنك الدخول الى مساحتك الشخصية.",
        mailboxPromptTitle: "افحص بريدك الالكتروني",
        mailboxPromptSubtitle: "لتفعيل حسابك، قم بتأكيد بريدك عبر الرابط المرسل.",
        resetMailboxSubtitle: "لاعادة تعيين كلمة المرور، افحص بريدك ثم اكتب الرمز الذي وصلك.",
        mailboxPromptAction: "الذهاب الى صندوق البريد",
        mailboxPromptBack: "الذهاب الى تسجيل الدخول",
        resetLinkInvalid: "رابط اعادة التعيين غير صالح. اطلب رابطا جديدا.",
        resetLinkExpired: "انتهت صلاحية رابط اعادة التعيين. اطلب رابطا جديدا."
      },
      labels: {
        serial: "الرقم",
        facebook: "فيسبوك",
        tiktok: "تيك توك",
        instagram: "انستغرام",
        whatsapp: "واتساب",
        email: "البريد"
      }
    },
    sportsProfile: {
      title: "اكمال الملف الرياضي",
      subtitle: "هذه المعلومات تساعد على تحضير متابعة مناسبة لك.",
      physicalTitle: "1. المعلومات الجسدية",
      sportTitle: "3. المعلومات الرياضية",
      supplementsTitle: "2. المكملات الغذائية",
      healthTitle: "4. الاصابات والمعلومات الطبية",
      required: "اجباري",
      optional: "اختياري",
      heightCm: "الطول بالسنتيمتر",
      currentWeightKg: "الوزن الحالي بالكيلوغرام",
      sportPracticed: "الرياضة الممارسة",
      sportLevel: "المستوى الرياضي",
      sportGoal: "الهدف الرئيسي",
      sportGoalCustom: "حدد هدفك",
      sessionsPerWeek: "عدد الحصص في الاسبوع",
      noSport: "لا امارس اي رياضة",
      addSport: "اضافة رياضة",
      removeSport: "حذف",
      sportNumber: "رياضة",
      noSupplement: "لا أستخدم أي مكمل غذائي",
      noInjury: "لا توجد إصابة",
      noMedicalInformation: "لا توجد معلومات طبية",
      supplementNumber: "مكمل",
      addSupplement: "اضافة مكمل",
      removeSupplement: "حذف",
      supplementName: "اسم المكمل",
      supplementDose: "الجرعة / الكمية",
      supplementUnit: "الوحدة",
      supplementFrequency: "التكرار",
      supplementTiming: "وقت التناول",
      supplementCategory: "الفئة",
      supplementStartDate: "تاريخ البداية",
      supplementStatus: "الحالة",
      supplementStatusHelp: {
        title: "معنى الحالة",
        ongoing: "قيد الاستخدام: ما زلت تستخدم هذا المكمل حاليا.",
        stopped: "متوقف: لم تعد تستخدم هذا المكمل حاليا."
      },
      supplementCustomValue: "حدد",
      supplementRemark: "ملاحظة",
      supplementRemarkPlaceholder: "مثال: يؤخذ مع الماء، بعد الوجبة ...",
      injuries: "الاصابات",
      injuryNumber: "اصابة",
      addInjury: "اضافة اصابة",
      removeInjury: "حذف",
      injuryZone: "المنطقة المعنية",
      injuryStartDate: "تاريخ البداية",
      injuryStatus: "الحالة",
      injuryStatusHelp: {
        title: "معنى الحالة",
        ongoing: "قيد المتابعة: الاصابة ما زالت موجودة او تحت المراقبة.",
        completed: "منتهية: الاصابة لم تعد نشطة حاليا."
      },
      injuryRemark: "ملاحظة",
      injuryRemarkPlaceholder: "مثال: ألم خفيف بعد التدريب",
      medicalTitle: "معلومات طبية",
      medicalNumber: "مشكلة طبية",
      addMedical: "اضافة مشكلة طبية",
      removeMedical: "حذف",
      medicalProblemName: "اسم المشكلة الطبية",
      medicalDescription: "الوصف",
      medicalStartDate: "تاريخ البداية",
      medicalStatus: "الحالة",
      medicalStatusHelp: {
        title: "معنى الحالة",
        ongoing: "قيد المتابعة: المشكلة الطبية ما زالت موجودة او تحت المراقبة.",
        completed: "منتهية: المشكلة الطبية لم تعد نشطة حاليا."
      },
      medicalRemark: "ملاحظة",
      medicalRemarkPlaceholder: "مثال: أشعر أحيانا بانزعاج أثناء المجهود البدني",
      remarks: "ملاحظات",
      save: "حفظ الملف",
      saving: "جار الحفظ...",
      success: "تم اكمال الملف الرياضي.",
      requiredError: "يرجى ملء كل المعلومات الاجبارية.",
      sessionExpired: "يجب تحديث الاتصال. سجل الدخول من جديد لاكمال ملفك.",
      dashboardTitle: "لوحة التحكم",
      dashboardSubtitle: "ملفك الرياضي جاهز.",
      editProfile: "تعديل الملف الرياضي",
      logout: "تسجيل الخروج",
      levelOptions: {
        beginner: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم"
      },
      goalOptions: {
        weight_loss: "خسارة الوزن",
        fat_loss_cut: "خسارة الدهون / تنشيف",
        muscle_hypertrophy: "تضخم عضلي",
        vascular_hypertrophy: "تضخم وعائي",
        mobility: "مرونة وحركة",
        strength: "قوة عضلية",
        body_recomposition: "اعادة تركيب الجسم / الايض",
        other: "آخر"
      }
    },
    footer: {
      rights: "جميع الحقوق محفوظة - هشام مشكور"
    }
  }
};

const languageOptions = {
  fr: { label: "FR", flag: "🇫🇷", name: "Francais" },
  en: { label: "EN", flag: "🇬🇧", name: "English" },
  ar: { label: "AR", flag: "🇸🇦", name: "العربية" }
};
const countryCodes =
  "AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(" ");
const countryLocaleMap = { fr: "fr", en: "en", ar: "ar" };
const countryOptionsCache = new Map();
const todayInputDate = new Date().toISOString().slice(0, 10);
const sportLevelValues = ["beginner", "intermediate", "advanced"];
const sportGoalValues = [
  "weight_loss",
  "fat_loss_cut",
  "muscle_hypertrophy",
  "vascular_hypertrophy",
  "mobility",
  "strength",
  "body_recomposition",
  "other"
];
const supplementNameOptions = [
  "Whey protéine",
  "Créatine",
  "BCAA",
  "EAA",
  "Oméga-3",
  "Magnésium",
  "Vitamine D",
  "Multivitamines",
  "Pré-workout",
  "Caféine",
  "Électrolytes",
  "Collagène",
  "Zinc",
  "Fer",
  "Glutamine",
  "Protéines végétales",
  "Autre"
];
const supplementUnitOptions = [
  "g",
  "mg",
  "µg",
  "ml",
  "L",
  "capsule",
  "gélule",
  "comprimé",
  "dosette",
  "sachet",
  "goutte",
  "cuillère",
  "portion",
  "dose",
  "ampoule",
  "flacon",
  "spray",
  "autre"
];
const supplementFrequencyOptions = [
  "Tous les jours",
  "Avant l’entraînement",
  "Après l’entraînement",
  "Le matin",
  "Le soir",
  "1 fois par semaine",
  "Autre"
];
const supplementTimingOptions = [
  "Le matin",
  "Le midi",
  "Le soir",
  "Avant l’entraînement",
  "Après l’entraînement",
  "Pendant l’entraînement",
  "Au coucher",
  "Avec un repas",
  "À jeun",
  "Selon besoin",
  "Autre"
];
const supplementCategoryOptions = [
  "Protéines",
  "Performance",
  "Vitamines",
  "Minéraux",
  "Récupération",
  "Énergie",
  "Santé générale",
  "Autre"
];
const supplementStatusValues = [
  { value: "ongoing", label: "En cours" },
  { value: "stopped", label: "Arrêté" }
];
const injuryZoneOptions = [
  "Cou",
  "Épaules",
  "Bras",
  "Coudes",
  "Poignets",
  "Main",
  "Dos",
  "Lombaires",
  "Hanches",
  "Genoux",
  "Chevilles",
  "Pieds",
  "Poitrine",
  "Abdominaux",
  "Jambes",
  "Mollets",
  "Autre"
];
const medicalProblemOptions = [
  "Asthme",
  "Diabète",
  "Hypertension",
  "Problème cardiaque",
  "Problème respiratoire",
  "Problème articulaire",
  "Problème de dos",
  "Problème de genou",
  "Problème d’épaule",
  "Problème de hanche",
  "Problème de cheville",
  "Trouble de la thyroïde",
  "Anémie",
  "Épilepsie",
  "Autre"
];
const healthStatusValues = [
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" }
];
const dashboardNavKeys = new Set(["dashboard", "programs", "shop", "exercises", "appointments", "messages", "comments", "settings"]);
const sportProfileFields =
  "first_name,last_name,date_of_birth,sex,country_code,avatar_url,phone_number,phone_country_code,phone_verified_at,address_line1,address_line2,postal_code,city,region,created_at,height_cm,current_weight_kg,has_no_sport,sport_practices,sport_practiced,sport_level,sport_goal,sport_goal_custom,sessions_per_week,injuries,remarks,has_no_supplement,dietary_supplements,has_no_injury,injury_history,has_no_medical_information,medical_information,sport_profile_completed_at";
const countryDialCodeMap = {
  AF: "+93",
  AX: "+358",
  AL: "+355",
  DZ: "+213",
  AS: "+1",
  AD: "+376",
  AO: "+244",
  AI: "+1",
  AQ: "+672",
  AG: "+1",
  AR: "+54",
  AM: "+374",
  AW: "+297",
  AU: "+61",
  AT: "+43",
  AZ: "+994",
  BS: "+1",
  BH: "+973",
  BD: "+880",
  BB: "+1",
  BY: "+375",
  FR: "+33",
  BE: "+32",
  BZ: "+501",
  BJ: "+229",
  BM: "+1",
  BT: "+975",
  BO: "+591",
  BQ: "+599",
  BA: "+387",
  BW: "+267",
  BV: "+47",
  BR: "+55",
  IO: "+246",
  BN: "+673",
  BG: "+359",
  BF: "+226",
  BI: "+257",
  CV: "+238",
  KH: "+855",
  CM: "+237",
  CA: "+1",
  KY: "+1",
  CF: "+236",
  TD: "+235",
  CL: "+56",
  CN: "+86",
  CX: "+61",
  CC: "+61",
  CO: "+57",
  KM: "+269",
  CG: "+242",
  CD: "+243",
  CK: "+682",
  CR: "+506",
  CI: "+225",
  HR: "+385",
  CU: "+53",
  CW: "+599",
  CY: "+357",
  CZ: "+420",
  DK: "+45",
  DJ: "+253",
  DM: "+1",
  DO: "+1",
  EC: "+593",
  EG: "+20",
  SV: "+503",
  GQ: "+240",
  ER: "+291",
  EE: "+372",
  SZ: "+268",
  ET: "+251",
  FK: "+500",
  FO: "+298",
  FJ: "+679",
  FI: "+358",
  GF: "+594",
  PF: "+689",
  TF: "+262",
  GA: "+241",
  GM: "+220",
  GE: "+995",
  DE: "+49",
  GH: "+233",
  GI: "+350",
  GR: "+30",
  GL: "+299",
  GD: "+1",
  GP: "+590",
  GU: "+1",
  GT: "+502",
  GG: "+44",
  GN: "+224",
  GW: "+245",
  GY: "+592",
  HT: "+509",
  HM: "+672",
  VA: "+39",
  HN: "+504",
  HK: "+852",
  HU: "+36",
  IS: "+354",
  IN: "+91",
  ID: "+62",
  IR: "+98",
  IQ: "+964",
  IE: "+353",
  IM: "+44",
  IL: "+972",
  IT: "+39",
  JM: "+1",
  JP: "+81",
  JE: "+44",
  JO: "+962",
  KZ: "+7",
  KE: "+254",
  KI: "+686",
  KP: "+850",
  KR: "+82",
  KW: "+965",
  KG: "+996",
  LA: "+856",
  LV: "+371",
  LB: "+961",
  LS: "+266",
  LR: "+231",
  LY: "+218",
  LI: "+423",
  LT: "+370",
  LU: "+352",
  MO: "+853",
  MG: "+261",
  MW: "+265",
  MY: "+60",
  MV: "+960",
  SN: "+221",
  ML: "+223",
  MT: "+356",
  MH: "+692",
  MQ: "+596",
  MR: "+222",
  MU: "+230",
  YT: "+262",
  MX: "+52",
  FM: "+691",
  MD: "+373",
  MC: "+377",
  MN: "+976",
  ME: "+382",
  MS: "+1",
  MA: "+212",
  MZ: "+258",
  MM: "+95",
  NA: "+264",
  NR: "+674",
  NP: "+977",
  NL: "+31",
  NC: "+687",
  NZ: "+64",
  NI: "+505",
  NE: "+227",
  NG: "+234",
  NU: "+683",
  NF: "+672",
  MK: "+389",
  MP: "+1",
  NO: "+47",
  OM: "+968",
  PK: "+92",
  PW: "+680",
  PS: "+970",
  PA: "+507",
  PG: "+675",
  PY: "+595",
  PE: "+51",
  PH: "+63",
  PN: "+64",
  PL: "+48",
  PT: "+351",
  PR: "+1",
  QA: "+974",
  RE: "+262",
  RO: "+40",
  RU: "+7",
  RW: "+250",
  BL: "+590",
  SH: "+290",
  KN: "+1",
  LC: "+1",
  MF: "+590",
  PM: "+508",
  VC: "+1",
  WS: "+685",
  SM: "+378",
  ST: "+239",
  SA: "+966",
  RS: "+381",
  SC: "+248",
  SL: "+232",
  SG: "+65",
  SX: "+1",
  SK: "+421",
  SI: "+386",
  SB: "+677",
  SO: "+252",
  ZA: "+27",
  GS: "+500",
  SS: "+211",
  ES: "+34",
  LK: "+94",
  SD: "+249",
  SR: "+597",
  SJ: "+47",
  SE: "+46",
  CH: "+41",
  SY: "+963",
  TW: "+886",
  TJ: "+992",
  TZ: "+255",
  TH: "+66",
  TL: "+670",
  TG: "+228",
  TK: "+690",
  TO: "+676",
  TT: "+1",
  TN: "+216",
  TR: "+90",
  TM: "+993",
  TC: "+1",
  TV: "+688",
  UG: "+256",
  UA: "+380",
  AE: "+971",
  GB: "+44",
  US: "+1",
  UM: "+1",
  UY: "+598",
  UZ: "+998",
  VU: "+678",
  VE: "+58",
  VN: "+84",
  VG: "+1",
  VI: "+1",
  WF: "+681",
  EH: "+212",
  YE: "+967",
  ZM: "+260",
  ZW: "+263",
};
const emptySportEntry = {
  sportPracticed: "",
  sportLevel: "",
  sessionsPerWeek: ""
};
const emptySupplementEntry = {
  name: "",
  customName: "",
  dose: "",
  unit: "",
  customUnit: "",
  frequency: "",
  customFrequency: "",
  timing: "",
  customTiming: "",
  category: "",
  customCategory: "",
  startDate: "",
  status: "ongoing",
  remark: ""
};
const emptyInjuryEntry = {
  zone: "",
  customZone: "",
  startDate: "",
  status: "ongoing",
  remark: ""
};
const emptyMedicalEntry = {
  name: "",
  customName: "",
  description: "",
  startDate: "",
  status: "ongoing",
  remark: ""
};
const emptySportProfileForm = {
  heightCm: "",
  currentWeightKg: "",
  hasNoSport: false,
  sports: [{ ...emptySportEntry }],
  hasNoSupplement: false,
  supplements: [{ ...emptySupplementEntry }],
  hasNoInjury: false,
  injuryEntries: [{ ...emptyInjuryEntry }],
  hasNoMedicalInformation: false,
  medicalEntries: [{ ...emptyMedicalEntry }],
  sportGoal: "",
  sportGoalCustom: "",
  injuries: "",
  remarks: ""
};
const emptySettingsForm = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
  country: "",
  phoneNumber: "",
  phoneCountryCode: "",
  phoneVerifiedAt: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  region: "",
  newEmail: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};
const athleteAvatarCatalog = {
  male: Array.from({ length: 10 }, (_, index) => `/avatars/homme/avatar-homme-${index + 1}.png`),
  female: Array.from({ length: 10 }, (_, index) => `/avatars/femme%20/avatar-femme-${index + 1}.png`)
};
// Avatars réservés au coach (public/avatars-coach/1.png … 10.png)
const coachAvatarCatalog = Array.from({ length: 10 }, (_, index) => `/avatars-coach/${index + 1}.png`);

function getAthleteAvatarOptions(sex) {
  return String(sex || "").toLowerCase() === "female" ? athleteAvatarCatalog.female : athleteAvatarCatalog.male;
}

function getAthleteSexLabel(sex) {
  return String(sex || "").toLowerCase() === "female" ? "Femme" : "Homme";
}

function getCountryDialCode(countryCode) {
  return countryDialCodeMap[String(countryCode || "").toUpperCase()] || "+";
}

function getOrCreateSignupClientId() {
  try {
    const existing = window.localStorage.getItem("hm-signup-client-id");
    if (existing) return existing;

    const nextId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `signup-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem("hm-signup-client-id", nextId);
    return nextId;
  } catch {
    return "";
  }
}

function isAdultBirthDate(value) {
  if (!value) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;

  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDelta = today.getMonth() + 1 - month;
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < day)) {
    age -= 1;
  }

  return age >= 18;
}

function normalizeSupplementEntry(supplement = {}) {
  const name = String(supplement.name || supplement.supplement_name || "").trim();
  const unit = String(supplement.unit || "").trim();
  const frequency = String(supplement.frequency || "").trim();
  const timing = String(supplement.timing || supplement.moment || "").trim();
  const category = String(supplement.category || "").trim();
  const status = String(supplement.status || "ongoing").trim() === "stopped" ? "stopped" : "ongoing";

  return {
    name,
    custom_name: String(supplement.custom_name || supplement.customName || "").trim(),
    dose:
      supplement.dose === null || supplement.dose === undefined || supplement.dose === ""
        ? null
        : Number(supplement.dose),
    unit,
    custom_unit: String(supplement.custom_unit || supplement.customUnit || "").trim(),
    frequency,
    custom_frequency: String(supplement.custom_frequency || supplement.customFrequency || "").trim(),
    timing,
    custom_timing: String(supplement.custom_timing || supplement.customTiming || "").trim(),
    category,
    custom_category: String(supplement.custom_category || supplement.customCategory || "").trim(),
    start_date: supplement.start_date || supplement.startDate || "",
    status,
    remark: String(supplement.remark || supplement.notes || "").trim()
  };
}

function normalizeInjuryEntry(injury = {}) {
  const zone = String(injury.zone || "").trim();
  const status = String(injury.status || "ongoing").trim() === "completed" ? "completed" : "ongoing";

  return {
    zone,
    custom_zone: String(injury.custom_zone || injury.customZone || "").trim(),
    start_date: injury.start_date || injury.startDate || "",
    status,
    remark: String(injury.remark || "").trim()
  };
}

function normalizeMedicalEntry(medical = {}) {
  const name = String(medical.name || medical.problem_name || medical.problemName || "").trim();
  const status = String(medical.status || "ongoing").trim() === "completed" ? "completed" : "ongoing";

  return {
    name,
    custom_name: String(medical.custom_name || medical.customName || "").trim(),
    description: String(medical.description || "").trim(),
    start_date: medical.start_date || medical.startDate || "",
    status,
    remark: String(medical.remark || "").trim()
  };
}

function normalizeSportProfile(profile = {}) {
  const rawSports = Array.isArray(profile.sport_practices) ? profile.sport_practices : [];
  const legacySport =
    profile.sport_practiced && profile.sport_practiced !== "none"
      ? [
        {
          sport_practiced: profile.sport_practiced,
          sport_level: profile.sport_level || "",
          sessions_per_week: profile.sessions_per_week ?? null
        }
      ]
      : [];
  const normalizedSports = (rawSports.length ? rawSports : legacySport)
    .map((sport) => ({
      sport_practiced: String(sport?.sport_practiced || sport?.sportPracticed || "").trim(),
      sport_level: String(sport?.sport_level || sport?.sportLevel || "").trim(),
      sessions_per_week:
        sport?.sessions_per_week === null || sport?.sessions_per_week === undefined
          ? null
          : Number(sport.sessions_per_week)
    }))
    .filter((sport) => sport.sport_practiced);
  const hasNoSport = Boolean(profile.has_no_sport || profile.sport_practiced === "none");
  const rawSupplements = Array.isArray(profile.dietary_supplements) ? profile.dietary_supplements : [];
  const normalizedSupplements = rawSupplements
    .map(normalizeSupplementEntry)
    .filter((supplement) => supplement.name || supplement.custom_name);
  const hasNoSupplement = Boolean(profile.has_no_supplement || profile.dietary_supplements_status === "none");
  const normalizedInjuries = (Array.isArray(profile.injury_history) ? profile.injury_history : [])
    .map(normalizeInjuryEntry)
    .filter((injury) => injury.zone || injury.custom_zone);
  const hasNoInjury = Boolean(profile.has_no_injury || profile.injury_history_status === "none");
  const normalizedMedicalInformation = (Array.isArray(profile.medical_information) ? profile.medical_information : [])
    .map(normalizeMedicalEntry)
    .filter((medical) => medical.name || medical.custom_name);
  const hasNoMedicalInformation = Boolean(
    profile.has_no_medical_information ||
    profile.has_no_medical ||
    profile.medical_information_status === "none"
  );
  const sportGoal = String(profile.sport_goal || "").trim();
  const sportGoalCustom = String(profile.sport_goal_custom || profile.sportGoalCustom || "").trim();

  return {
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    date_of_birth: profile.date_of_birth || null,
    sex: profile.sex || "",
    country_code: profile.country_code || "",
    avatar_url: profile.avatar_url || "",
    phone_number: profile.phone_number || "",
    phone_country_code: profile.phone_country_code || "",
    phone_verified_at: profile.phone_verified_at || null,
    address_line1: profile.address_line1 || "",
    address_line2: profile.address_line2 || "",
    postal_code: profile.postal_code || "",
    city: profile.city || "",
    region: profile.region || "",
    created_at: profile.created_at || null,
    height_cm: profile.height_cm ?? null,
    current_weight_kg: profile.current_weight_kg ?? null,
    has_no_sport: hasNoSport,
    sport_practices: hasNoSport ? [] : normalizedSports,
    has_no_supplement: hasNoSupplement,
    dietary_supplements: hasNoSupplement ? [] : normalizedSupplements,
    has_no_injury: hasNoInjury,
    injury_history: hasNoInjury ? [] : normalizedInjuries,
    has_no_medical_information: hasNoMedicalInformation,
    medical_information: hasNoMedicalInformation ? [] : normalizedMedicalInformation,
    sport_practiced: profile.sport_practiced || "",
    sport_level: profile.sport_level || "",
    sport_goal: sportGoal,
    sport_goal_custom: sportGoal === "other" ? sportGoalCustom : "",
    sessions_per_week: profile.sessions_per_week ?? null,
    injuries: profile.injuries || "",
    remarks: profile.remarks || "",
    sport_profile_completed_at: profile.sport_profile_completed_at || null
  };
}

function profileSettingsToForm(user = {}, profile = {}) {
  const normalized = normalizeSportProfile(profile);
  const country = normalized.country_code || user.country || "";

  return {
    firstName: normalized.first_name || user.firstName || "",
    lastName: normalized.last_name || user.lastName || "",
    avatarUrl: normalized.avatar_url || user.avatarUrl || "",
    country,
    phoneNumber: normalized.phone_number || user.phoneNumber || "",
    phoneCountryCode: normalized.phone_country_code || user.phoneCountryCode || getCountryDialCode(country),
    phoneVerifiedAt: normalized.phone_verified_at || user.phoneVerifiedAt || "",
    addressLine1: normalized.address_line1 || user.addressLine1 || "",
    addressLine2: normalized.address_line2 || user.addressLine2 || "",
    postalCode: normalized.postal_code || user.postalCode || "",
    city: normalized.city || user.city || "",
    region: normalized.region || user.region || "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  };
}

function settingsFormToProfilePayload(form) {
  return {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    country_code: form.country
  };
}

function areSameSettingsSnapshot(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function settingsProfileSnapshot(form = {}) {
  return {
    firstName: String(form.firstName || "").trim(),
    lastName: String(form.lastName || "").trim(),
    avatarUrl: String(form.avatarUrl || "").trim(),
    country: String(form.country || "")
  };
}

function settingsContactSnapshot(form = {}) {
  return {
    phoneNumber: String(form.phoneNumber || "").trim(),
    phoneCountryCode: getCountryDialCode(form.country),
    addressLine1: String(form.addressLine1 || "").trim(),
    addressLine2: String(form.addressLine2 || "").trim(),
    postalCode: String(form.postalCode || "").trim(),
    city: String(form.city || "").trim(),
    region: String(form.region || "").trim()
  };
}

function sportCoreSnapshot(form = {}) {
  const sports = form.hasNoSport
    ? []
    : (Array.isArray(form.sports) ? form.sports : [])
      .map((sport) => ({
        sport_practiced: String(sport.sportPracticed || "").trim(),
        sport_level: String(sport.sportLevel || ""),
        sessions_per_week:
          sport.sessionsPerWeek === "" || sport.sessionsPerWeek === null || sport.sessionsPerWeek === undefined
            ? null
            : Number(sport.sessionsPerWeek)
      }))
      .filter((sport) => sport.sport_practiced);

  return {
    height_cm: form.heightCm === "" ? null : Number(form.heightCm),
    current_weight_kg: form.currentWeightKg === "" ? null : Number(form.currentWeightKg),
    has_no_sport: Boolean(form.hasNoSport),
    sport_practices: sports,
    sport_goal: String(form.sportGoal || ""),
    sport_goal_custom: form.sportGoal === "other" ? String(form.sportGoalCustom || "").trim() : "",
    remarks: String(form.remarks || "").trim()
  };
}

function nutritionSnapshot(form = {}) {
  return {
    has_no_supplement: Boolean(form.hasNoSupplement),
    dietary_supplements: sportProfileFormToSupplements(form)
  };
}

function healthSnapshot(form = {}) {
  return {
    has_no_injury: Boolean(form.hasNoInjury),
    injury_history: sportProfileFormToInjuries(form),
    has_no_medical_information: Boolean(form.hasNoMedicalInformation),
    medical_information: sportProfileFormToMedicalInformation(form)
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("PHOTO_READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

async function resizeAvatarFile(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("PHOTO_INVALID");
  }

  if (file.size > 6 * 1024 * 1024) {
    throw new Error("PHOTO_TOO_LARGE");
  }

  const dataUrl = await readFileAsDataUrl(file);

  if (typeof window === "undefined" || typeof document === "undefined" || typeof Image === "undefined") {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 640;
      const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
      const width = Math.max(1, Math.round(image.width * ratio));
      const height = Math.max(1, Math.round(image.height * ratio));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        resolve(dataUrl);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

function isSportProfileComplete(profile = {}) {
  const normalized = normalizeSportProfile(profile);
  const hasValidSportInformation =
    normalized.has_no_sport ||
    (normalized.sport_practices.length > 0 &&
      normalized.sport_practices.every(
        (sport) =>
          sport.sport_practiced.trim() &&
          sportLevelValues.includes(sport.sport_level) &&
          Number.isInteger(Number(sport.sessions_per_week)) &&
          Number(sport.sessions_per_week) >= 0
      ));
  const hasValidSupplementInformation =
    normalized.has_no_supplement ||
    (normalized.dietary_supplements.length > 0 &&
      normalized.dietary_supplements.every(
        (supplement) =>
          (supplement.name || supplement.custom_name) &&
          Number(supplement.dose) > 0 &&
          (supplement.unit || supplement.custom_unit) &&
          (supplement.frequency || supplement.custom_frequency) &&
          (supplement.timing || supplement.custom_timing) &&
          (supplement.category || supplement.custom_category) &&
          ["ongoing", "stopped"].includes(supplement.status)
      ));
  const hasValidInjuryInformation = normalized.has_no_injury || normalized.injury_history.length > 0;
  const hasValidMedicalInformation =
    normalized.has_no_medical_information || normalized.medical_information.length > 0;
  const hasValidGoal =
    sportGoalValues.includes(normalized.sport_goal) &&
    (normalized.sport_goal !== "other" || Boolean(normalized.sport_goal_custom));

  return Boolean(
    Number(normalized.height_cm) > 0 &&
    Number(normalized.current_weight_kg) > 0 &&
    hasValidGoal &&
    hasValidSportInformation &&
    hasValidSupplementInformation &&
    hasValidInjuryInformation &&
    hasValidMedicalInformation
  );
}

function sportProfileToForm(profile = {}) {
  const normalized = normalizeSportProfile(profile);
  const sports = normalized.sport_practices.length
    ? normalized.sport_practices.map((sport) => ({
      sportPracticed: sport.sport_practiced || "",
      sportLevel: sport.sport_level || "",
      sessionsPerWeek:
        sport.sessions_per_week === null || sport.sessions_per_week === undefined
          ? ""
          : String(sport.sessions_per_week)
    }))
    : [{ ...emptySportEntry }];
  const supplements = normalized.dietary_supplements.length
    ? normalized.dietary_supplements.map((supplement) => ({
      name: supplement.name || "",
      customName: supplement.custom_name || "",
      dose: supplement.dose === null || supplement.dose === undefined ? "" : String(supplement.dose),
      unit: supplement.unit || "",
      customUnit: supplement.custom_unit || "",
      frequency: supplement.frequency || "",
      customFrequency: supplement.custom_frequency || "",
      timing: supplement.timing || "",
      customTiming: supplement.custom_timing || "",
      category: supplement.category || "",
      customCategory: supplement.custom_category || "",
      startDate: supplement.start_date || "",
      status: supplement.status || "ongoing",
      remark: supplement.remark || ""
    }))
    : [{ ...emptySupplementEntry }];
  const injuryEntries = normalized.injury_history.length
    ? normalized.injury_history.map((injury) => ({
      zone: injury.zone || "",
      customZone: injury.custom_zone || "",
      startDate: injury.start_date || "",
      status: injury.status || "ongoing",
      remark: injury.remark || ""
    }))
    : [{ ...emptyInjuryEntry }];
  const medicalEntries = normalized.medical_information.length
    ? normalized.medical_information.map((medical) => ({
      name: medical.name || "",
      customName: medical.custom_name || "",
      description: medical.description || "",
      startDate: medical.start_date || "",
      status: medical.status || "ongoing",
      remark: medical.remark || ""
    }))
    : [{ ...emptyMedicalEntry }];

  return {
    heightCm: normalized.height_cm ? String(normalized.height_cm) : "",
    currentWeightKg: normalized.current_weight_kg ? String(normalized.current_weight_kg) : "",
    hasNoSport: normalized.has_no_sport,
    sports,
    hasNoSupplement: normalized.has_no_supplement,
    supplements,
    hasNoInjury: normalized.has_no_injury,
    injuryEntries,
    hasNoMedicalInformation: normalized.has_no_medical_information,
    medicalEntries,
    sportGoal: normalized.sport_goal,
    sportGoalCustom: normalized.sport_goal_custom,
    injuries: normalized.injuries,
    remarks: normalized.remarks
  };
}

function sportProfileFormToSupplements(form) {
  if (form.hasNoSupplement) return [];

  return form.supplements
    .map((supplement) => ({
      name: supplement.name,
      custom_name: supplement.name === "Autre" ? supplement.customName.trim() : "",
      dose: Number(supplement.dose),
      unit: supplement.unit,
      custom_unit: supplement.unit === "autre" ? supplement.customUnit.trim() : "",
      frequency: supplement.frequency,
      custom_frequency: supplement.frequency === "Autre" ? supplement.customFrequency.trim() : "",
      timing: supplement.timing,
      custom_timing: supplement.timing === "Autre" ? supplement.customTiming.trim() : "",
      category: supplement.category,
      custom_category: supplement.category === "Autre" ? supplement.customCategory.trim() : "",
      start_date: supplement.startDate,
      status: supplement.status === "stopped" ? "stopped" : "ongoing",
      remark: supplement.remark.trim()
    }))
    .filter((supplement) => supplement.name || supplement.custom_name);
}

function sportProfileFormToInjuries(form) {
  if (form.hasNoInjury) return [];

  return form.injuryEntries
    .map((injury) => ({
      zone: injury.zone,
      custom_zone: injury.zone === "Autre" ? injury.customZone.trim() : "",
      start_date: injury.startDate,
      status: injury.status === "completed" ? "completed" : "ongoing",
      remark: injury.remark.trim()
    }))
    .filter((injury) => injury.zone || injury.custom_zone || injury.start_date || injury.remark);
}

function sportProfileFormToMedicalInformation(form) {
  if (form.hasNoMedicalInformation) return [];

  return form.medicalEntries
    .map((medical) => ({
      name: medical.name,
      custom_name: medical.name === "Autre" ? medical.customName.trim() : "",
      description: medical.description.trim(),
      start_date: medical.startDate,
      status: medical.status === "completed" ? "completed" : "ongoing",
      remark: medical.remark.trim()
    }))
    .filter((medical) => medical.name || medical.custom_name || medical.description || medical.start_date || medical.remark);
}

function hasSportEntryContent(sport = {}) {
  return Boolean(sport.sportPracticed?.trim() || sport.sportLevel || sport.sessionsPerWeek);
}

function areSportFieldsValid(form) {
  if (form.hasNoSport) return true;
  if (!Array.isArray(form.sports) || form.sports.length === 0) return false;

  const filledSports = form.sports.filter(hasSportEntryContent);
  if (filledSports.length === 0) return false;

  return filledSports.every((sport) => {
    const sessions = Number(sport.sessionsPerWeek);
    return Boolean(
      sport.sportPracticed.trim() &&
      sportLevelValues.includes(sport.sportLevel) &&
      Number.isInteger(sessions) &&
      sessions >= 0 &&
      sessions <= 21
    );
  });
}

function hasSupplementEntryContent(supplement = {}) {
  return Boolean(
    supplement.name ||
    supplement.customName?.trim() ||
    supplement.dose ||
    supplement.unit ||
    supplement.customUnit?.trim() ||
    supplement.frequency ||
    supplement.customFrequency?.trim() ||
    supplement.timing ||
    supplement.customTiming?.trim() ||
    supplement.category ||
    supplement.customCategory?.trim() ||
    supplement.startDate ||
    supplement.remark?.trim()
  );
}

function hasInjuryEntryContent(injury = {}) {
  return Boolean(injury.zone || injury.customZone?.trim() || injury.startDate || injury.remark?.trim());
}

function hasMedicalEntryContent(medical = {}) {
  return Boolean(
    medical.name || medical.customName?.trim() || medical.description?.trim() || medical.startDate || medical.remark?.trim()
  );
}

function areSupplementFieldsValid(form) {
  if (form.hasNoSupplement) return true;
  if (!Array.isArray(form.supplements) || form.supplements.length === 0) return false;

  const filledSupplements = form.supplements.filter(hasSupplementEntryContent);
  if (filledSupplements.length === 0) return false;

  return filledSupplements.every((supplement) => {
    const dose = Number(supplement.dose);
    const hasName = supplement.name && (supplement.name !== "Autre" || supplement.customName.trim());
    const hasUnit = supplement.unit && (supplement.unit !== "autre" || supplement.customUnit.trim());
    const hasFrequency =
      supplement.frequency && (supplement.frequency !== "Autre" || supplement.customFrequency.trim());
    const hasTiming = supplement.timing && (supplement.timing !== "Autre" || supplement.customTiming.trim());
    const hasCategory =
      supplement.category && (supplement.category !== "Autre" || supplement.customCategory.trim());

    return Boolean(
      hasName &&
      Number.isFinite(dose) &&
      dose > 0 &&
      hasUnit &&
      hasFrequency &&
      hasTiming &&
      hasCategory &&
      ["ongoing", "stopped"].includes(supplement.status)
    );
  });
}

function areInjuryFieldsValid(form) {
  if (form.hasNoInjury) return true;
  if (!Array.isArray(form.injuryEntries) || form.injuryEntries.length === 0) return false;

  const filledInjuries = form.injuryEntries.filter(hasInjuryEntryContent);
  if (filledInjuries.length === 0) return false;

  return filledInjuries.every((injury) => {
    return Boolean(
      injury.zone &&
      (injury.zone !== "Autre" || injury.customZone.trim()) &&
      ["ongoing", "completed"].includes(injury.status)
    );
  });
}

function areMedicalFieldsValid(form) {
  if (form.hasNoMedicalInformation) return true;
  if (!Array.isArray(form.medicalEntries) || form.medicalEntries.length === 0) return false;

  const filledMedicalEntries = form.medicalEntries.filter(hasMedicalEntryContent);
  if (filledMedicalEntries.length === 0) return false;

  return filledMedicalEntries.every((medical) => {
    return Boolean(
      medical.name &&
      (medical.name !== "Autre" || medical.customName.trim()) &&
      medical.description.trim() &&
      ["ongoing", "completed"].includes(medical.status)
    );
  });
}

function isSportGoalFieldValid(form) {
  return Boolean(
    sportGoalValues.includes(form.sportGoal) &&
    (form.sportGoal !== "other" || String(form.sportGoalCustom || "").trim())
  );
}

function sportProfileFormToPayload(form) {
  const sports = form.hasNoSport
    ? []
    : form.sports
      .map((sport) => ({
        sport_practiced: sport.sportPracticed.trim(),
        sport_level: sport.sportLevel,
        sessions_per_week: Number(sport.sessionsPerWeek)
      }))
      .filter((sport) => sport.sport_practiced);
  const firstSport = sports[0] || null;
  const injuries = sportProfileFormToInjuries(form);

  return {
    height_cm: Number(form.heightCm),
    current_weight_kg: Number(form.currentWeightKg),
    has_no_sport: Boolean(form.hasNoSport),
    sport_practices: sports,
    sport_practiced: form.hasNoSport ? "none" : firstSport?.sport_practiced || "",
    sport_level: form.hasNoSport ? "" : firstSport?.sport_level || "",
    sport_goal: form.sportGoal,
    sessions_per_week: form.hasNoSport ? null : firstSport?.sessions_per_week ?? null,
    injuries: injuries
      .map((injury) => `${injury.zone === "Autre" ? injury.custom_zone : injury.zone} - ${injury.status}`)
      .join("\n"),
    remarks: form.remarks.trim(),
    sport_profile_completed_at: new Date().toISOString()
  };
}

function sanitizePositiveNumberInput(value, { integer = false, maxDecimals = 1 } = {}) {
  const normalized = String(value || "").replace(",", ".");
  const digitsOnly = normalized.replace(/[^\d.]/g, "");
  const [head = "", ...rest] = digitsOnly.split(".");
  const safeHead = head.replace(/\D/g, "");

  if (integer || rest.length === 0) {
    return safeHead;
  }

  return `${safeHead}.${rest.join("").replace(/\D/g, "").slice(0, maxDecimals)}`;
}

function preventInvalidNumberKey(event) {
  if (["-", "+", "e", "E"].includes(event.key)) {
    event.preventDefault();
  }
}

function formatDisplayDate(value, locale = "fr") {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function getAthleteMatricule(userId) {
  const source = String(userId || "athlete").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `HF-${source.slice(0, 8).padEnd(8, "0")}`;
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join("");
  return initials.toUpperCase() || "HF";
}

function formatPersonName(name = "") {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part ? `${part[0].toLocaleUpperCase("fr-FR")}${part.slice(1).toLocaleLowerCase("fr-FR")}` : ""
        )
        .join("-")
    )
    .join(" ");
}

function getNameInitials(firstName = "", lastName = "", fallbackName = "") {
  const names = [firstName, lastName].map((name) => String(name || "").trim()).filter(Boolean);
  const initials = names.map((name) => name[0]).join("");
  return initials.length >= 2 ? initials.toUpperCase() : getInitials(names.join(" ") || fallbackName);
}

function BrandAppText({ text = "HICHAM-FIT APP", appClassName = "" }) {
  const value = String(text || "");
  const appIndex = value.toUpperCase().lastIndexOf("APP");

  if (appIndex < 0) return value;

  return (
    <>
      {value.slice(0, appIndex)}
      <span className={appClassName}>{value.slice(appIndex, appIndex + 3)}</span>
      {value.slice(appIndex + 3)}
    </>
  );
}

function getUserDisplayName(user) {
  if (!user) return "";

  const fullName = formatPersonName(user.fullName || `${user.firstName || ""} ${user.lastName || ""}`);
  return fullName || user.email || "Athlete";
}

function normalizeClientReview(review = {}) {
  const authorId = String(review.authorId || review.author_id || "").trim();
  const authorName = String(review.authorName || review.author_name || "").trim();
  const avatarUrl = String(review.avatarUrl || review.avatar_url || "").trim();
  const message = String(review.message || "").trim();
  const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

  if (!authorName || !message || !rating) return null;

  return {
    id: String(review.id || `review-${Date.now()}`),
    authorId,
    authorName,
    avatarUrl,
    rating,
    message,
    createdAt: review.createdAt || review.created_at || new Date().toISOString()
  };
}

function buildWeightSeries(currentWeight, range) {
  const base = Number(currentWeight) || 78;
  const length = range === "week" ? 7 : range === "year" ? 12 : 8;
  const drift = range === "year" ? 0.45 : range === "month" ? 0.28 : 0.18;

  return Array.from({ length }, (_, index) => {
    const offset = index - (length - 1);
    const wave = Math.sin(index * 0.9) * 0.35;
    return Number((base + offset * drift + wave).toFixed(1));
  });
}

function buildObjectiveSeries(goal) {
  const map = {
    fat_loss_cut: {
      title: "Taux de masse grasse",
      unit: "%",
      values: [24, 23.2, 22.5, 21.8, 21.1, 20.4]
    },
    muscle_hypertrophy: {
      title: "Mensurations",
      unit: "cm",
      values: [35, 35.4, 35.8, 36.1, 36.5, 37]
    },
    vascular_hypertrophy: {
      title: "Seances realisees",
      unit: "",
      values: [3, 4, 4, 5, 5, 6]
    },
    mobility: {
      title: "Score de mobilite",
      unit: "%",
      values: [60, 64, 68, 72, 76, 80]
    },
    strength: {
      title: "Progression des charges",
      unit: "kg",
      values: [60, 64, 68, 72, 76, 80]
    },
    body_recomposition: {
      title: "Masse grasse",
      unit: "%",
      values: [20, 19.2, 18.5, 17.6, 16.8, 16]
    }
  };

  return map[goal] || null;
}

function getChartPath(values, width = 520, height = 180, padding = 18) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function ProgressChart({ title, unit, values, action, compact }) {
  const path = getChartPath(values);
  const lastValue = values[values.length - 1] ?? 0;
  const gradientId = `chart-gradient-${title.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <div className={`rounded-2xl border border-slate-600/45 bg-slate-950/30 ${compact ? "p-2" : "p-4"}`}>
      <div className={`flex flex-wrap items-start justify-between gap-2 ${compact ? "" : "gap-3"}`}>
        <div>
          <p
            className={`font-bold uppercase tracking-[0.14em] text-slate-400 ${compact ? "text-[9px]" : "text-[11px]"}`}
          >
            {title}
          </p>
          <p className={`font-black text-white ${compact ? "mt-0.5 text-base" : "mt-1 text-2xl"}`}>
            {lastValue}
            {unit ? (
              <span className={`ml-1 text-slate-300 ${compact ? "text-xs" : "text-sm"}`}>{unit}</span>
            ) : null}
          </p>
        </div>
        {action}
      </div>
      <svg
        viewBox="0 0 520 180"
        className={`w-full overflow-visible ${compact ? "mt-1 h-[4.25rem] sm:h-[4.75rem]" : "mt-4 h-44"}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(52,211,153)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(52,211,153)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="18"
            x2="502"
            y1={18 + line * 48}
            y2={18 + line * 48}
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="1"
          />
        ))}
        <path d={`${path} L 502 162 L 18 162 Z`} fill={`url(#${gradientId})`} />
        <path
          d={path}
          fill="none"
          stroke="rgb(52,211,153)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={compact ? "3" : "4"}
        />
        {values.map((value, index) => {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = Math.max(max - min, 1);
          const x = 18 + index * (484 / Math.max(values.length - 1, 1));
          const y = 162 - ((value - min) / range) * 144;
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="4.5" fill="rgb(16,185,129)" stroke="#0f172a" strokeWidth="2" />;
        })}
      </svg>
    </div>
  );
}

const athleteCardDecorUrl = "/decor de la carte athlete.png";

// Carrousel publicitaire du tableau de bord (6 slides, rotation automatique toutes les 5 s).
function DashboardAdCarousel({ firstName, go }) {
  const slides = [
    { tag: "Bienvenue", emoji: "👋", hero: "/image_Slide0.png", title: `Bienvenue ${firstName || ""} sur Hicham Fit App`.trim(), desc: "Progressez avec un meilleur suivi, accédez à vos programmes personnalisés, découvrez vos exercices et avancez à votre rythme avec l'accompagnement de Coach Hicham." },
    { tag: "Boutique", emoji: "🛍️", hero: "/image_Slide1.png", title: "Découvrez notre boutique sportive", desc: "Retrouvez des produits sélectionnés pour accompagner vos entraînements et améliorer vos performances.", btn: "Voir la boutique", view: "shop" },
    { tag: "Programme", emoji: "📋", hero: "/image_Slide2.png", title: "Programme personnalisé disponible", desc: "Suivez un programme adapté à votre objectif et progressez étape par étape avec Coach Hicham.", btn: "Voir mes programmes", view: "programs" },
    { tag: "Exercices", emoji: "🏋️", hero: "/image_Slide3.png", title: "Explorez la bibliothèque d'exercices", desc: "Accédez à une bibliothèque complète d'exercices avec démonstrations, conseils et filtres pour construire vos séances plus facilement.", btn: "Voir les exercices", view: "exercises" },
    { tag: "Paiement sécurisé", emoji: "🔒", hero: "/image_Slide4.png", title: "Paiement sécurisé et flexible", desc: "Réglez vos programmes, produits ou abonnements en toute simplicité : carte bancaire, PayPal, Revolut Pay et autres méthodes via Stripe." },
    { tag: "Rendez-vous", emoji: "📅", hero: "/image_Slide5.png", title: "Prenez rendez-vous avec Coach Hicham", desc: "Réservez un rendez-vous en visio ou en appel audio pour poser vos questions, ajuster votre programme, suivre votre progression et recevoir des conseils personnalisés.", btn: "Prendre rendez-vous", view: "appointments" },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);
  const s = slides[i];
  const nav = (
    <div className="absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-1.5">
      {slides.map((_, idx) => (
        <button key={idx} type="button" onClick={() => setI(idx)} aria-label={`Diapo ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-emerald-500" : `w-1.5 ${s.hero ? "bg-slate-300 hover:bg-slate-400" : "bg-slate-600 hover:bg-slate-400"}`}`} />
      ))}
    </div>
  );

  // Slide 0 (Bienvenue) : les atouts restent rattaches au bloc texte, sous le paragraphe.
  if (s.hero) {
    const isWelcomeSlide = s.tag === "Bienvenue";
    const isPaymentSlide = s.tag === "Paiement sécurisé";
    const heroFeatures = [
      { label: "Suivi intelligent", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M4 20h16" /><rect x="5" y="12" width="3" height="7" rx="0.6" /><rect x="10.5" y="8" width="3" height="11" rx="0.6" /><rect x="16" y="4" width="3" height="15" rx="0.6" /></svg>) },
      { label: "Programmes personnalisés", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><rect x="6" y="4" width="12" height="16" rx="2" /><rect x="9" y="2.5" width="6" height="3" rx="1" /><path d="M9.5 12.5l2 2 3.5-3.5" /></svg>) },
      { label: "Exercices variés", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M4 9v6M7 7v10M17 7v10M20 9v6" /><path d="M7 12h10" /></svg>) },
      { label: "Accompagnement expert", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0115 0" /></svg>) },
    ];
    return (
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative flex h-[238px] shrink-0 flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/70 to-slate-100 shadow-inner md:h-[252px]">
        <div className="relative min-h-0 flex-1">
          <img
            src={s.hero}
            alt="Hicham Fit App"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className={`pointer-events-none absolute right-0 top-0 hidden h-full object-fill object-right sm:block ${isPaymentSlide ? "w-[74%]" : "w-[68%]"}`}
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, transparent 9%, rgba(0,0,0,0.7) 20%, #000 32%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 9%, rgba(0,0,0,0.7) 20%, #000 32%)"
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-center px-5 py-4 pb-6 md:px-7 md:py-5 md:pb-7">
            <div className="max-w-full sm:max-w-[55%]">
              {isWelcomeSlide ? (
                <>
                  <div className="translate-y-2">
                    <h3 className="mt-2 font-display text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-[34px]">
                      Bienvenue {firstName ? <><span className="capitalize text-emerald-500">{firstName}</span> </> : null}sur Hicham Fit App
                    </h3>
                    <p className="mt-2 border-l-2 border-emerald-400 pl-3 text-[11px] leading-snug text-slate-600 sm:text-xs">
                      Progressez avec un meilleur suivi, accédez à vos programmes personnalisés, découvrez vos exercices et avancez à votre rythme avec l'accompagnement de <span className="font-semibold text-emerald-600">Coach Hicham</span>.
                    </p>
                  </div>
                  <div className="mt-5 grid w-fit max-w-full translate-y-2 grid-cols-[repeat(4,4.35rem)] gap-0 rounded-2xl border border-white/90 bg-white/80 px-2 py-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.09)] backdrop-blur sm:grid-cols-[repeat(4,5.35rem)] sm:gap-1 sm:px-3 md:mt-6 md:grid-cols-[repeat(4,5.75rem)] md:py-2">
                    {heroFeatures.map((f) => (
                      <div key={f.label} className="flex min-w-0 flex-col items-center gap-1 text-center text-emerald-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100/70 text-emerald-600 ring-1 ring-emerald-200/80 shadow-[0_2px_5px_rgba(16,185,129,0.18)] sm:h-7 sm:w-7" aria-hidden="true">
                          {f.icon}
                        </span>
                        <span className="min-h-[1.65rem] text-[7px] font-semibold leading-tight text-slate-600 sm:text-[9px] md:text-[10px]">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="translate-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">{s.tag}</p>
                  <h3 className="mt-2 font-display text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-[34px]">
                    {s.title}
                  </h3>
                  <p className="mt-3 border-l-2 border-emerald-400 pl-3 text-xs leading-snug text-slate-600 sm:text-sm">
                    {s.desc}
                  </p>
                  {isPaymentSlide ? (
                    <div className="mt-3 grid w-full max-w-[21rem] grid-cols-3 gap-1.5 sm:gap-2" aria-label="Moyens de paiement acceptés">
                      {[
                        ["Visa", "/payement/visa.png", ""],
                        ["Mastercard", "/payement/mastercard.png", "scale-[1.28]"],
                        ["Carte bancaire", "/payement/carre_bancaire.png", "scale-[1.2]"],
                        ["PayPal", "/payement/paypal.png", ""],
                        ["Revolut", "/payement/revolut.png", "scale-[1.28]"],
                        ["CCP Poste Algerie", "/payement/ccp.png", "scale-[1.22]"],
                      ].map(([name, src, logoScale]) => (
                        <span key={name} className="inline-flex h-8 min-w-0 items-center justify-center rounded-lg border border-slate-200 bg-white/90 p-1 shadow-sm">
                          <img src={src} alt={name} className={`h-full w-full object-contain ${logoScale}`} loading="lazy" />
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {s.btn ? (
                    <button type="button" onClick={() => go(s.view)} className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_12px_26px_rgba(16,185,129,0.20)] transition hover:bg-emerald-300 sm:text-sm">
                      {s.btn}
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
        {nav}
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative flex h-[245px] shrink-0 flex-col justify-center overflow-hidden rounded-2xl border border-brand-300/25 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/50 p-4 md:h-[265px] md:p-6">
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
      <div className="relative z-10 flex flex-1 items-center gap-4 md:gap-5">
        <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400/40 to-emerald-500/25 text-5xl shadow-lg sm:flex md:h-24 md:w-24" aria-hidden>{s.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-200">{s.tag}</p>
          <h3 className="mt-1 font-display text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">{s.title}</h3>
          <p className="mt-1.5 line-clamp-3 text-xs leading-snug text-slate-300 sm:text-sm">{s.desc}</p>
          {s.btn ? (
            <button type="button" onClick={() => go(s.view)} className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-brand-300 bg-brand-400 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-brand-300 sm:text-sm">
              {s.btn}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          ) : null}
        </div>
      </div>
      {nav}
    </div>
  );
}

function AthleteLuxuryCard({ language, fullName, matricule, email, birthDate, country, registrationDate, initials, photoUrl }) {
  const ekgGradId = useId().replace(/:/g, "");
  const [isFlipped, setIsFlipped] = useState(false);
  const copy =
    language === "en"
      ? {
        coaching: "Hicham Coaching",
        cardBand: "Athlete card",
        coachLead: "Coach",
        coachName: "Hicham",
        proBadge: "Pro athlete",
        labels: ["Full name", "Athlete ID", "Date of birth", "Registration date"]
      }
      : language === "ar"
        ? {
          coaching: "هشام كوتشينغ",
          cardBand: "بطاقة الرياضي",
          coachLead: "المدرب",
          coachName: "هشام",
          proBadge: "رياضي محترف",
          labels: ["الاسم الكامل", "رقم الرياضي", "تاريخ الميلاد", "تاريخ التسجيل"]
        }
        : {
          coaching: "Hicham Coaching",
          cardBand: "Carte athlète",
          coachLead: "Coach",
          coachName: "Hicham",
          proBadge: "Athlète pro",
          labels: [
            "Nom complet",
            "Matricule",
            "Date de naissance",
            "Date d'inscription"
          ]
        };

  const displayFullName = formatPersonName(fullName) || fullName;
  const values = [displayFullName, matricule || email, birthDate, registrationDate];
  const iconClass = "h-3 w-3 text-slate-100";
  const icons = [
    <svg key="u" className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>,
    <svg key="id" className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm2 0v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"
      />
    </svg>,
    <svg key="cal" className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"
      />
    </svg>,
    <svg key="clip" className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
      />
    </svg>
  ];

  const coachIcon = (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h6v-1.5c0-.77.21-1.49.58-2.11A9.93 9.93 0 0 0 12 14zm6.5 1c-1.93 0-3.5 1.57-3.5 3.5V20h7v-1.5c0-1.93-1.57-3.5-3.5-3.5z" />
    </svg>
  );

  return (
    <article
      className={`athlete-pro-card mx-auto w-full max-w-[30rem] shrink-0 ${isFlipped ? "is-flipped" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Afficher la face principale de la carte athlète" : "Afficher le logo Hicham-Fit"}
      onClick={() => setIsFlipped((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((value) => !value);
        }
      }}
    >
      <div className="athlete-pro-card__flipper">
        <div className="athlete-pro-card__face athlete-pro-card__face--front">
          <div className="athlete-pro-card__carbon" aria-hidden />
          <div className="athlete-pro-card__metal" aria-hidden />

          {/* EXACT NEON LINES OVERLAY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 344 200" preserveAspectRatio="none">
            <defs>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neonGlowStrong" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* TRUE TRIANGLE carbon panel for the LOGO area (top-left) */}
            <path d="M 0 0 L 108 0 L 0 88 Z"
              fill="rgba(0,0,0,0.85)" stroke="#22c55e" strokeWidth="1.4" filter="url(#neonGlowStrong)" />

            {/* Bottom-left carbon panel cut with green stroke */}
            <path d="M 0 200 L 0 162 L 18 142 L 70 142 L 90 160 L 138 160 L 158 178 L 200 178 L 218 192 L 344 192 L 344 200 Z"
              fill="rgba(0,0,0,0.55)" stroke="#22c55e" strokeWidth="1.1" filter="url(#neonGlowStrong)" />

            {/* Top-right green tech accents */}
            <path d="M 255 22 L 312 22 L 322 34 L 344 34" stroke="#22c55e" strokeWidth="1.1" fill="none" filter="url(#neonGlow)" opacity="0.85" />
            <path d="M 220 184 L 264 184 L 272 192 L 310 192" stroke="#22c55e" strokeWidth="1" fill="none" filter="url(#neonGlow)" opacity="0.85" />
          </svg>

          <div className="athlete-pro-card__runner" aria-hidden>
            <img src={athleteCardDecorUrl} alt="" className="athlete-pro-card__runner-img" decoding="async" />
          </div>

          {/* LEFT: logo + photo hexagon + ENTRAÎNEMENT MENTAL PERFORMANCE */}
          <div className="athlete-pro-card__left">
            <img src={hmLogo} alt="Hicham Coaching" className="athlete-pro-card__logo-img" />
            <div className="athlete-pro-card__hex-wrap">
              {photoUrl ? (
                <img src={photoUrl} alt={fullName || "Athlete"} className="athlete-pro-card__hex-photo athlete-pro-card__hex-img" />
              ) : (
                <div className="athlete-pro-card__hex-photo font-display text-2xl font-black text-white sm:text-3xl">{initials}</div>
              )}
            </div>
          </div>

          {/* Mental block - moved below the card on the left side */}
          <div className="athlete-pro-card__mental-block">
            <svg className="athlete-pro-card__mental-dumbbell" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="2" y="9" width="2" height="6" rx="0.5" />
              <rect x="4.5" y="7" width="2.5" height="10" rx="0.6" />
              <rect x="7.5" y="11" width="9" height="2" rx="0.6" />
              <rect x="17" y="7" width="2.5" height="10" rx="0.6" />
              <rect x="20" y="9" width="2" height="6" rx="0.5" />
            </svg>
            <span className="athlete-pro-card__mental-divider" aria-hidden />
            <div className="athlete-pro-card__mental-text">
              <span>ENTRAÎNEMENT</span>
              <span>MENTAL</span>
              <span>PERFORMANCE</span>
            </div>
          </div>

          {/* RIGHT: card band + info rows + footer */}
          <div className="athlete-pro-card__right">
            <div className="athlete-pro-card__brand flex flex-col w-full">
              <div className="athlete-pro-card__brand-top">
                {copy.coaching.toUpperCase()}
              </div>
              <div className="min-w-0 w-full">
                <div className="athlete-pro-card__brand-sub">
                  <span className="athlete-pro-card__brand-band flex items-baseline">
                    <span className="text-white">{copy.cardBand.split(' ')[0]}</span>
                    <span className="text-[#22c55e] ml-1.5" style={{ textShadow: '0 0 12px rgba(34,197,94,0.7)' }}>{copy.cardBand.split(' ').slice(1).join(' ')}</span>
                    <span className="text-[#22c55e] ml-2 font-black italic tracking-widest text-[0.6rem] opacity-80">///</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full items-start relative z-10 mt-1">
              <div className="flex-1">
                <ul className="athlete-pro-card__list w-full">
                  {copy.labels.map((label, i) => (
                    <li key={label} className="athlete-pro-card__row">
                      <span className="athlete-pro-card__icon-hex">{icons[i]}</span>
                      <div className="min-w-0 flex-1 athlete-pro-card__info-grid">
                        <span className="athlete-pro-card__label">{label}</span>
                        <span className="athlete-pro-card__colon">:</span>
                        <span className="athlete-pro-card__value">{values[i] || "—"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Shield removed */}

          {/* Footer: only DÉPASSE TES LIMITES */}
          <div className="athlete-pro-card__tech-footer">
            <div className="athlete-pro-card__tagline-right">
              DÉPASSE&nbsp;TES&nbsp;LIMITES <span className="athlete-pro-card__tagline-slash">///</span>
            </div>
          </div>
        </div>
        <div className="athlete-pro-card__face athlete-pro-card__face--back" aria-hidden={!isFlipped}>
          <div className="athlete-pro-card__back-grid" aria-hidden />
          <div className="athlete-pro-card__back-frame" aria-hidden />
          <div className="athlete-pro-card__back-logo-ring">
            <img src={hmLogo} alt="" className="athlete-pro-card__back-logo" />
          </div>
          <div className="athlete-pro-card__back-title">
            <span>HICHAM-FIT</span>
            <span>APP</span>
          </div>
          <p className="athlete-pro-card__back-subtitle">ATHLETE PERFORMANCE SYSTEM</p>
        </div>
      </div>
    </article>
  );
}

const COACH_SLIDES = {
  fr: [
    {
      eyebrow: "Coaching personnalisé",
      title: "Profite d'un accompagnement personnalisé",
      description: "Un suivi sportif adapté à ton objectif pour progresser efficacement avec le coach Hicham.",
      cta: "Découvrir",
      image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "Programmes signature",
      title: "Découvre les programmes du coach",
      description: "Accède à des programmes structurés pour perdre du gras, gagner en force ou améliorer ta condition physique.",
      cta: "Voir les programmes",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "Boutique & ressources",
      title: "Boost ta progression",
      description: "Guides, conseils et ressources pour t'aider à rester motivé et atteindre des résultats durables.",
      cta: "Voir la boutique",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=720&auto=format&fit=crop"
    }
  ],
  en: [
    {
      eyebrow: "Personalised coaching",
      title: "Enjoy fully personalised coaching",
      description: "A training plan tailored to your goal so you can progress efficiently with coach Hicham.",
      cta: "Discover",
      image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "Signature programs",
      title: "Discover the coach's programs",
      description: "Access structured plans to lose fat, build strength or improve your physical condition.",
      cta: "See programs",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "Shop & resources",
      title: "Boost your progress",
      description: "Guides, tips and resources to help you stay motivated and reach lasting results.",
      cta: "Visit the shop",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=720&auto=format&fit=crop"
    }
  ],
  ar: [
    {
      eyebrow: "تدريب شخصي",
      title: "استفد من مرافقة شخصية",
      description: "متابعة رياضية مكيّفة مع هدفك للتقدم بفعالية مع المدرب هشام.",
      cta: "اكتشف",
      image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "البرامج المميزة",
      title: "اكتشف برامج المدرب",
      description: "احصل على برامج منظمة لخسارة الدهون أو زيادة القوة أو تحسين لياقتك البدنية.",
      cta: "عرض البرامج",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=720&auto=format&fit=crop"
    },
    {
      eyebrow: "المتجر والمصادر",
      title: "عزّز تقدمك",
      description: "أدلة ونصائح وموارد تساعدك على البقاء متحفزًا وتحقيق نتائج دائمة.",
      cta: "زيارة المتجر",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=720&auto=format&fit=crop"
    }
  ]
};

function DashboardSidebar({
  language = "fr",
  isOpen,
  onToggle,
  activeKey = "dashboard",
  onNavigate,
  onLogout,
  isLight = false,
  onToggleTheme,
  onLanguageChange,
  currentLanguageOption,
  languageOptions,
  isLangMenuOpen,
  onToggleLangMenu,
  athleteName = "",
  athleteSubtitle = "",
  athleteAvatarUrl = "",
  athleteInitials = "",
  isCoach = false,
  coachUnread = 0
}) {
  const labels = {
    fr: {
      dashboard: "Tableau de bord",
      programs: "Mes programmes",
      shop: "Boutique",
      exercises: "Exercices",
      appointments: "Rendez-vous",
      messages: "Messagerie",
      comments: "Commentaires",
      settings: "Paramètres",
      logout: "Déconnexion",
      collapse: "Réduire",
      expand: "Étendre",
      brandLine: "RÉVEILLE TON INSTINCT",
      brandName: "HICHAM-FIT APP"
    },
    en: {
      dashboard: "Dashboard",
      programs: "My programs",
      shop: "Shop",
      exercises: "Exercises",
      appointments: "Appointments",
      messages: "Messages",
      comments: "Comments",
      settings: "Settings",
      logout: "Logout",
      collapse: "Collapse",
      expand: "Expand",
      brandLine: "AWAKEN YOUR INSTINCT",
      brandName: "HICHAM-FIT APP"
    },
    ar: {
      dashboard: "لوحة التحكم",
      programs: "برامجي",
      shop: "المتجر",
      exercises: "تمارين",
      appointments: "المواعيد",
      messages: "الرسائل",
      comments: "التعليقات",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      collapse: "طي",
      expand: "توسيع",
      brandLine: "أيقظ غريزتك",
      brandName: "هشام-فيت APP"
    }
  };
  const t = labels[language] || labels.fr;

  const items = [
    {
      key: "dashboard",
      label: t.dashboard,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      )
    },
    {
      key: "programs",
      label: t.programs,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h9a3 3 0 0 1 3 3v13H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M6 16h12" />
          <path d="M9 8h6M9 12h4" />
        </svg>
      )
    },
    {
      key: "shop",
      label: t.shop,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18l-1.5 11A2 2 0 0 1 17.5 19h-11a2 2 0 0 1-2-1.99L3 6Z" />
          <path d="M8 6V4a4 4 0 0 1 8 0v2" />
        </svg>
      )
    },
    {
      key: "exercises",
      label: t.exercises,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5 17.5 17.5M4 9l2-2M20 15l-2 2M9 4 7 6M17 20l-2-2M3 14l4 4M21 10l-4-4" />
        </svg>
      )
    },
    {
      key: "appointments",
      label: t.appointments,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    ...(isCoach ? [{
      key: "comments",
      label: t.comments,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      )
    }] : []),
    {
      key: "settings",
      label: t.settings,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`hf-sidebar ${isOpen ? "is-open" : "is-collapsed"} ${isLight ? "is-light" : "is-dark"}`}
      data-testid="dashboard-sidebar"
      aria-label="Navigation principale"
    >
      <div className="hf-sidebar__inner">
        {/* Brand area */}
        <div className="hf-sidebar__brand">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="hf-sidebar__logo"
            aria-label={isOpen ? t.collapse : t.expand}
            aria-expanded={isOpen}
            data-testid="sidebar-toggle"
          >
            <img src={hmLogo} alt="" />
          </button>
          <span className="hf-sidebar__brand-text">
            <span className="hf-sidebar__brand-eyebrow">{t.brandLine}</span>
            <span className="hf-sidebar__brand-title"><BrandAppText text={t.brandName} /></span>
          </span>
        </div>

        {/* Athlete identity */}
        {athleteName ? (
          <div className="hf-sidebar__athlete" onClick={(e) => e.stopPropagation()}>
            <span className="hf-sidebar__athlete-avatar" aria-hidden>
              {athleteAvatarUrl ? (
                <img src={athleteAvatarUrl} alt="" />
              ) : (
                athleteInitials || getInitials(athleteName) || "?"
              )}
            </span>
            <span className="hf-sidebar__athlete-info">
              <span className="hf-sidebar__athlete-name">{athleteName}</span>
              {athleteSubtitle ? (
                <span className="hf-sidebar__athlete-sub">{athleteSubtitle}</span>
              ) : null}
            </span>
          </div>
        ) : null}

        {/* Nav items */}
        <nav className="hf-sidebar__nav" role="navigation" onClick={(e) => e.stopPropagation()}>
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              className={`hf-sidebar__item ${activeKey === item.key ? "is-active" : ""}`}
              data-testid={`sidebar-nav-${item.key}`}
              title={item.label}
            >
              <span className="hf-sidebar__item-icon">
                {item.icon}
                {item.badge ? <span className="hf-sidebar__item-dot" aria-hidden /> : null}
              </span>
              <span className="hf-sidebar__item-label">{item.label}</span>
              {item.badge ? <span className="hf-sidebar__item-count">{item.badge}</span> : null}
              {activeKey === item.key ? <span className="hf-sidebar__item-bar" aria-hidden /> : null}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="hf-sidebar__spacer-toggle"
          onClick={onToggle}
          aria-label={isOpen ? t.collapse : t.expand}
          title={isOpen ? t.collapse : t.expand}
        />

        {/* Footer: language + theme + logout */}
        <div className="hf-sidebar__footer" onClick={(e) => e.stopPropagation()}>
          <div className="hf-sidebar__footer-tools">
            <div className="hf-sidebar__lang">
              <button
                type="button"
                onClick={onToggleLangMenu}
                className="hf-sidebar__icon-btn"
                aria-haspopup="menu"
                aria-expanded={isLangMenuOpen}
                title={currentLanguageOption?.label || "Langue"}
              >
                <span className="hf-sidebar__icon-glyph text-base leading-none">{currentLanguageOption?.flag}</span>
                <span className="hf-sidebar__icon-btn-label">{currentLanguageOption?.name || currentLanguageOption?.label}</span>
              </button>
              {isLangMenuOpen ? (
                <div className="hf-sidebar__lang-menu">
                  {Object.entries(languageOptions || {}).map(([code, option]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLanguageChange?.(code)}
                      className={`hf-sidebar__lang-item ${language === code ? "is-current" : ""}`}
                    >
                      <span className="text-base leading-none">{option.flag}</span>
                      <span className="font-bold">{option.name}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="hf-sidebar__icon-btn"
              title={isLight ? "Mode sombre" : "Mode clair"}
            >
              <span className="hf-sidebar__icon-glyph text-base leading-none" aria-hidden>{isLight ? "☀️" : "🌙"}</span>
              <span className="hf-sidebar__icon-btn-label">{isLight ? "Jour" : "Nuit"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="hf-sidebar__logout"
            data-testid="sidebar-logout"
            title={t.logout}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hf-sidebar__item-icon hf-sidebar__logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hf-sidebar__item-label">{t.logout}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function CoachRecommendationCarousel({ language = "fr", greeting, name }) {
  const slides = COACH_SLIDES[language] || COACH_SLIDES.fr;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[activeIndex];
  const sectionTitle =
    language === "en"
      ? "Recommended by coach Hicham"
      : language === "ar"
        ? "موصى به من المدرب هشام"
        : "Recommandé par le coach Hicham";
  const greetingLine = name ? `${greeting}, ${name}` : greeting;

  return (
    <article
      className="coach-reco-card relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3 lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="coach-recommendation-carousel"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-200">
            {sectionTitle}
          </p>
          {greetingLine ? (
            <h2 className="mt-0.5 truncate font-display text-sm font-black text-white">
              {greetingLine}
            </h2>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full border border-brand-300/45 bg-brand-500/12 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-brand-100">
          {language === "ar" ? "هشام" : "Hicham"}
        </span>
      </div>

      <div
        key={activeIndex}
        className="coach-reco-slide mt-2 grid min-h-0 flex-1 grid-cols-[1fr_auto] items-stretch gap-2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-950/70 to-emerald-950/40 p-2.5"
        data-testid={`coach-slide-${activeIndex}`}
      >
        <div className="flex min-w-0 flex-col justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-brand-300">
              {slide.eyebrow}
            </p>
            <h3 className="mt-0.5 line-clamp-2 font-display text-[13px] font-black leading-tight text-white sm:text-sm">
              {slide.title}
            </h3>
            <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-slate-300">
              {slide.description}
            </p>
          </div>
          <button
            type="button"
            className="self-start rounded-full border border-brand-300/70 bg-gradient-to-r from-brand-500 to-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_8px_22px_-8px_rgba(34,197,94,0.6)] transition hover:brightness-110"
            data-testid={`coach-slide-cta-${activeIndex}`}
          >
            {slide.cta}
          </button>
        </div>
        <div className="relative h-full w-[140px] shrink-0 overflow-hidden rounded-xl border border-brand-300/35 sm:w-[180px] lg:w-[200px]">
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-950/30" aria-hidden />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5" role="tablist" aria-label={sectionTitle}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === activeIndex
                ? "w-5 bg-brand-300 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "w-1.5 bg-white/25 hover:bg-white/45"
              }`}
            data-testid={`coach-slide-dot-${i}`}
          />
        ))}
      </div>
    </article>
  );
}

function SettingsIcon({ name, className = "" }) {
  const icons = {
    settings:
      "M19.4 13.5c.08-.48.1-.98.1-1.5s-.02-1.02-.1-1.5l2.1-1.65-2-3.46-2.48 1a7.7 7.7 0 0 0-2.6-1.5L14 2.25h-4l-.42 2.64a7.7 7.7 0 0 0-2.6 1.5l-2.48-1-2 3.46 2.1 1.65c-.08.48-.1.98-.1 1.5s.02 1.02.1 1.5l-2.1 1.65 2 3.46 2.48-1a7.7 7.7 0 0 0 2.6 1.5L10 21.75h4l.42-2.64a7.7 7.7 0 0 0 2.6-1.5l2.48 1 2-3.46-2.1-1.65ZM12 15.25A3.25 3.25 0 1 1 12 8.75a3.25 3.25 0 0 1 0 6.5Z",
    shop:
      "M6.2 7.2 7.4 3.8h9.2l1.2 3.4h2.4v13H3.8v-13h2.4Zm2.9 0h5.8l-.55-1.7h-4.7L9.1 7.2Zm-1.2 3.1a4.1 4.1 0 0 0 8.2 0h1.8a5.9 5.9 0 0 1-11.8 0h1.8Z",
    profile:
      "M12 12.4a4.9 4.9 0 1 0-4.9-4.9 4.9 4.9 0 0 0 4.9 4.9Zm-8.4 8.1c.5-3.9 3.8-6.6 8.4-6.6s7.9 2.7 8.4 6.6H3.6Z",
    contact:
      "M4.5 5.5h15v13h-15v-13Zm1.7 2.2 5.8 4.1 5.8-4.1H6.2Zm11.6 8.6V9.7l-5.3 3.7a.9.9 0 0 1-1 0L6.2 9.7v6.6h11.6Z",
    phone:
      "M6.6 3.2h3.15l1.35 4.45-2.15 1.4a12.3 12.3 0 0 0 5.95 5.95l1.45-2.12 4.45 1.35v3.15c0 1.05-.82 1.92-1.86 1.98C10.9 19.8 4.2 13.1 4.64 5.06A1.98 1.98 0 0 1 6.6 3.2Z",
    address:
      "M12 2.8a6.4 6.4 0 0 0-6.4 6.4c0 4.8 6.4 12 6.4 12s6.4-7.2 6.4-12A6.4 6.4 0 0 0 12 2.8Zm0 8.9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z",
    athlete:
      "M12 2.6 14.4 8l5.9.5-4.45 3.9 1.35 5.8L12 15.15 6.8 18.2l1.35-5.8L3.7 8.5 9.6 8 12 2.6Z",
    security:
      "M12 2.8 19 6v5.3c0 4.45-2.75 8.4-7 9.9-4.25-1.5-7-5.45-7-9.9V6l7-3.2Zm0 2.2L7 7.3v4c0 3.3 1.9 6.25 5 7.55 3.1-1.3 5-4.25 5-7.55v-4L12 5Zm-2 6.7 1.25 1.25L14.8 9.4l1.25 1.25-4.8 4.8L8.75 13 10 11.7Z",
    info:
      "M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm0 4.6a1.18 1.18 0 1 1 0 2.36 1.18 1.18 0 0 1 0-2.36Zm1.3 10.05h-2.55v-1.55h.48v-3.45h-.48v-1.55h2.1v5h.45v1.55Z",
    danger:
      "M12 2 1.8 20.2h20.4L12 2Zm1 13.4h-2V17h2v-1.6Zm0-6.9h-2v5.1h2V8.5Z",
    save:
      "M5 3h12l2 2v16H5V3Zm2 2v5h9V5H7Zm2 10v4h6v-4H9Z",
    comments:
      "M4 3.5h16A1.5 1.5 0 0 1 21.5 5v10A1.5 1.5 0 0 1 20 16.5H9.6L4.9 21v-4.5H4A1.5 1.5 0 0 1 2.5 15V5A1.5 1.5 0 0 1 4 3.5Zm3 4.2v1.6h10V7.7H7Zm0 3.4v1.6h7v-1.6H7Z"
  };

  return (
    <svg viewBox="0 0 24 24" className={className || "h-4 w-4"} aria-hidden="true">
      <path fill="currentColor" d={icons[name] || icons.settings} />
    </svg>
  );
}

function SettingsSectionHeader({ icon, eyebrow, title, action, danger = false }) {
  return (
    <div className="settings-card__head">
      <div className="settings-section-title">
        <span className={`settings-section-icon ${danger ? "is-danger" : ""}`}>
          <SettingsIcon name={icon} className="h-4 w-4" />
        </span>
        <div>
          <p className={`settings-card__eyebrow ${danger ? "text-red-200" : ""}`}>{eyebrow}</p>
          <h2 className="settings-card__title">{title}</h2>
        </div>
      </div>
      {action}
    </div>
  );
}

const shopCategoryOptions = [
  "Tous",
  "Programmes sportifs",
  "Guides nutrition",
  "Livres / Ebooks",
  "Packs coaching",
  "Plans d'entraînement",
  "Recettes healthy",
  "Challenges sportifs"
];

const shopPriceTypeOptions = ["Tous", "Gratuit", "Payant"];
const shopSearchExamples = ["Perte de gras", "Prise de masse", "Nutrition", "Musculation"];

const shopProducts = [
  {
    id: "fat-loss-program",
    title: "Programme Perte de gras",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "49 €",
    badge: "Programme",
    description: "Plan progressif pour perdre du gras avec séances structurées et suivi des efforts.",
    longDescription:
      "Un programme complet de 12 semaines pour perdre du gras durablement : séances structurées, progression contrôlée et suivi des efforts. Chaque semaine combine entraînement en résistance et cardio ciblé pour préserver ta masse musculaire tout en réduisant la masse grasse.",
    tags: ["Perte de gras", "Musculation", "Sèche"],
    images: [transfo1, transfo2, transfo3]
  },
  {
    id: "mass-gain-plan",
    title: "Plan Prise de masse",
    category: "Plans d'entraînement",
    priceType: "Payant",
    price: "39 €",
    badge: "Plan",
    description: "Cycle d'entraînement orienté hypertrophie avec progression hebdomadaire.",
    longDescription:
      "Cycle d'entraînement orienté hypertrophie avec progression hebdomadaire des charges et du volume. Idéal pour construire du muscle de façon méthodique, avec des repères de récupération et de nutrition pour optimiser la prise de masse.",
    tags: ["Prise de masse", "Hypertrophie", "Musculation"],
    images: [coachHero]
  },
  {
    id: "nutrition-guide",
    title: "Guide nutrition sportive",
    category: "Guides nutrition",
    priceType: "Gratuit",
    price: "Gratuit",
    badge: "Guide",
    description: "Bases simples pour mieux organiser tes repas autour de ton objectif.",
    longDescription:
      "Les bases simples et concrètes pour organiser tes repas autour de ton objectif : répartition des macronutriments, exemples de journées types et conseils pour rester régulier sans frustration.",
    tags: ["Nutrition", "Repas", "Objectif"],
    images: [coachingIlage]
  },
  {
    id: "healthy-recipes",
    title: "Recettes healthy express",
    category: "Recettes healthy",
    priceType: "Gratuit",
    price: "Gratuit",
    badge: "Recettes",
    description: "Idées rapides et équilibrées pour rester régulier sans compliquer la cuisine.",
    longDescription:
      "Une sélection de recettes rapides, équilibrées et savoureuses pour rester régulier sans passer des heures en cuisine. Parfait pour les journées chargées.",
    tags: ["Nutrition", "Recettes healthy", "Repas"],
    images: []
  },
  {
    id: "coaching-pack",
    title: "Pack coaching transformation",
    category: "Packs coaching",
    priceType: "Payant",
    price: "99 €",
    badge: "Coaching",
    description: "Ressources premium et accompagnement pour une transformation encadrée.",
    longDescription:
      "Le pack premium pour une transformation complète et encadrée : programme personnalisé, plan nutritionnel, suivi régulier et ajustements stratégiques. L'accompagnement le plus complet pour atteindre tes objectifs.",
    tags: ["Coaching", "Perte de gras", "Prise de masse"],
    images: [coachHero, coachHeroAlt]
  },
  {
    id: "ebook-strength",
    title: "Ebook Force et technique",
    category: "Livres / Ebooks",
    priceType: "Payant",
    price: "19 €",
    badge: "Ebook",
    description: "Repères techniques pour progresser sur les mouvements de base.",
    longDescription:
      "Un ebook concentré sur la technique des mouvements de base (squat, développé, soulevé de terre) : repères d'exécution, erreurs fréquentes et stratégies pour progresser en force en toute sécurité.",
    tags: ["Force", "Musculation", "Technique"],
    images: [mmImage]
  },
  {
    id: "summer-challenge",
    title: "Challenge sportif 21 jours",
    category: "Challenges sportifs",
    priceType: "Gratuit",
    price: "Gratuit",
    badge: "Challenge",
    description: "Défi court pour relancer ta discipline avec objectifs simples chaque semaine.",
    longDescription:
      "Un défi de 21 jours pour relancer ta discipline avec des objectifs simples et progressifs chaque semaine. Idéal pour reprendre une routine et créer de bonnes habitudes.",
    tags: ["Challenge", "Remise en forme", "Cardio"],
    images: []
  },
  {
    id: "hiit-burn",
    title: "Programme HIIT brûle-graisse",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "29 €",
    badge: "Programme",
    description: "Séances HIIT courtes et intenses pour brûler un maximum de calories.",
    longDescription:
      "Un programme de 6 semaines basé sur le HIIT : des séances courtes (20 à 30 min) mais très intenses pour brûler un maximum de calories, améliorer ton cardio et accélérer la perte de gras, même avec un emploi du temps chargé.",
    tags: ["HIIT", "Cardio", "Perte de gras"],
    images: [transfo2, transfo3]
  },
  {
    id: "powerlifting-plan",
    title: "Plan Powerlifting force max",
    category: "Plans d'entraînement",
    priceType: "Payant",
    price: "45 €",
    badge: "Plan",
    description: "Cycle de force sur les trois mouvements de powerlifting.",
    longDescription:
      "Un cycle de force structuré sur le squat, le développé couché et le soulevé de terre, avec progression des charges, gestion de la fatigue et pics de performance. Idéal pour battre tes records en toute sécurité.",
    tags: ["Force", "Powerlifting", "Musculation"],
    images: [coachHero]
  },
  {
    id: "nutrition-advanced",
    title: "Ebook Nutrition avancée",
    category: "Livres / Ebooks",
    priceType: "Payant",
    price: "25 €",
    badge: "Ebook",
    description: "Stratégies nutritionnelles avancées pour optimiser ta composition corporelle.",
    longDescription:
      "Cet ebook approfondit la nutrition sportive : timing des nutriments, recharges glucidiques, gestion des phases de sèche et de prise de masse, et ajustements selon tes résultats. Pour aller plus loin que les bases.",
    tags: ["Nutrition", "Sèche", "Performance"],
    images: [coachingIlage]
  },
  {
    id: "competition-prep",
    title: "Pack Préparation compétition",
    category: "Packs coaching",
    priceType: "Payant",
    price: "149 €",
    badge: "Coaching",
    description: "Accompagnement complet pour préparer une compétition de bodybuilding.",
    longDescription:
      "Le pack premium pour préparer une compétition : programmation de la prépa, peak week, nutrition de précision, posing et suivi rapproché. L'accompagnement le plus complet pour monter sur scène dans ta meilleure forme.",
    tags: ["Compétition", "Bodybuilding", "Coaching"],
    images: [coachHero, coachHeroAlt, mmImage]
  },
  {
    id: "full-body-4w",
    title: "Programme Full Body 4 semaines",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "35 €",
    badge: "Programme",
    description: "Programme full body complet pour débutants et intermédiaires.",
    longDescription:
      "Un programme full body sur 4 semaines, parfait pour reprendre ou poser des bases solides : 3 séances par semaine couvrant tout le corps, avec progression simple et conseils d'exécution.",
    tags: ["Full body", "Musculation", "Débutant"],
    images: []
  },
  {
    id: "shred-8w",
    title: "Programme Shred 8 semaines",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "59 €",
    badge: "Programme",
    description: "Sèche avancée sur 8 semaines pour révéler la définition musculaire.",
    longDescription:
      "Un programme de sèche intensif sur 8 semaines combinant musculation, cardio et stratégie nutritionnelle pour réduire la masse grasse tout en préservant le muscle. Pour un physique défini et dessiné.",
    tags: ["Sèche", "Définition", "Cardio"],
    images: [transfo1, transfo3]
  },
  {
    id: "mobility-plan",
    title: "Plan Mobilité & Souplesse",
    category: "Plans d'entraînement",
    priceType: "Payant",
    price: "22 €",
    badge: "Plan",
    description: "Routines de mobilité pour gagner en amplitude et prévenir les blessures.",
    longDescription:
      "Un plan de mobilité et de souplesse avec des routines quotidiennes courtes pour améliorer ton amplitude articulaire, réduire les douleurs et prévenir les blessures à l'entraînement.",
    tags: ["Mobilité", "Souplesse", "Récupération"],
    images: [coachHeroAlt]
  },
  {
    id: "meal-prep-guide",
    title: "Guide Meal Prep",
    category: "Guides nutrition",
    priceType: "Payant",
    price: "18 €",
    badge: "Guide",
    description: "Organise tes repas de la semaine en une seule session de cuisine.",
    longDescription:
      "Le guide complet du meal prep : listes de courses, recettes batch-cooking et organisation pour préparer tous tes repas de la semaine en une seule session, sans stress et en respectant tes macros.",
    tags: ["Nutrition", "Organisation", "Batch cooking"],
    images: [coachingIlage, mmImage]
  },
  {
    id: "home-workout",
    title: "Programme Maison sans matériel",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "27 €",
    badge: "Programme",
    description: "Entraînements efficaces à la maison, zéro équipement requis.",
    longDescription:
      "Un programme conçu pour s'entraîner efficacement à la maison sans aucun matériel : exercices au poids du corps, progressions et variantes pour continuer à progresser où que tu sois.",
    tags: ["Maison", "Poids du corps", "Sans matériel"],
    images: []
  },
  {
    id: "ebook-recovery",
    title: "Ebook Récupération & Sommeil",
    category: "Livres / Ebooks",
    priceType: "Payant",
    price: "15 €",
    badge: "Ebook",
    description: "Optimise ta récupération et ton sommeil pour mieux progresser.",
    longDescription:
      "Cet ebook explique comment optimiser ta récupération : gestion du sommeil, étirements, nutrition post-effort et stratégies pour réduire la fatigue et progresser plus vite.",
    tags: ["Récupération", "Sommeil", "Bien-être"],
    images: [coachHero]
  },
  {
    id: "elite-coaching",
    title: "Coaching Élite 1-à-1",
    category: "Packs coaching",
    priceType: "Payant",
    price: "199 €",
    badge: "Coaching",
    description: "Accompagnement individuel premium avec suivi hebdomadaire personnalisé.",
    longDescription:
      "Le coaching le plus poussé : programme 100% personnalisé, plan nutritionnel sur mesure, ajustements hebdomadaires et accès direct au coach. Pour atteindre tes objectifs avec un suivi d'élite.",
    tags: ["Coaching", "Premium", "Suivi 1-à-1"],
    images: [coachHero, coachHeroAlt, ifbbDiploma]
  },
  {
    id: "discovery-program",
    title: "Programme Découverte",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "9 €",
    badge: "Découverte",
    description: "Petit programme d'essai pour tester le paiement et découvrir la méthode.",
    longDescription:
      "Un programme court et accessible pour découvrir la méthode Hicham Fit App : quelques séances clés pour te lancer en douceur. Idéal pour tester l'application et le paiement.",
    tags: ["Découverte", "Débutant", "Essai"],
    images: [coachHero]
  },
  {
    id: "express-abs",
    title: "Programme Abdos Express",
    category: "Plans d'entraînement",
    priceType: "Payant",
    price: "12 €",
    badge: "Plan",
    description: "Routine ciblée abdos / gainage à faire en 15 minutes par jour.",
    longDescription:
      "Une routine express centrée sur les abdominaux et le gainage : exercices ciblés, progression sur 4 semaines, faisable à la maison en 15 minutes par jour.",
    tags: ["Abdos", "Gainage", "Maison"],
    images: [mmImage]
  },
  {
    id: "cardio-blast",
    title: "Programme Cardio Blast",
    category: "Programmes sportifs",
    priceType: "Payant",
    price: "15 €",
    badge: "Cardio",
    description: "Séances cardio intenses pour brûler un maximum de calories.",
    longDescription:
      "Un programme cardio dynamique pour augmenter ton endurance et brûler un maximum de calories : intervalles, circuits et progression contrôlée sur plusieurs semaines.",
    tags: ["Cardio", "Endurance", "Brûle-graisse"],
    images: [transfo1]
  }
];

// Créneaux horaires définis par le coach Hicham, par jour de la semaine (0 = dimanche … 6 = samedi)
const coachWeeklyAvailability = {
  1: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  2: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  3: ["10:00", "11:00", "15:00", "16:00", "17:00"],
  4: ["09:00", "10:00", "14:00", "15:00", "16:00"],
  5: ["09:00", "10:00", "11:00"],
  6: ["10:00", "11:00"]
};

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Durée d'un créneau, en minutes. Le coach Hicham peut la changer librement (ex. 30, 45, 90…).
const coachSlotDurationMin = 60;

function addMinutesToTime(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatSlotRange(time) {
  return `${time}-${addMinutesToTime(time, coachSlotDurationMin)}`;
}

// Coach Hicham réside en Algérie : les créneaux qu'il définit sont en heure d'Algérie
// (GMT+1, sans heure d'été). On calcule l'instant réel avec ce décalage fixe, puis on
// affiche l'heure dans le fuseau local de chaque visiteur (France, etc.).
const COACH_UTC_OFFSET = "+01:00";

function coachSlotInstant(dateKey, time) {
  return new Date(`${dateKey}T${time}:00${COACH_UTC_OFFSET}`);
}

function appointmentConfirmAt(dateKey) {
  return new Date(`${dateKey}T00:00:00`).getTime();
}

function appointmentStartAt(appt) {
  return coachSlotInstant(appt.date, appt.time).getTime();
}

function getAppointmentStatus(appt, now = new Date()) {
  if (!appt) return "upcoming";
  if (appt.cancelled) return "cancelled";
  if (appt.joined) return "joined";
  const nowMs = now.getTime();
  if (nowMs > appointmentStartAt(appt) + 10 * 60000) return "expired";
  return nowMs < appointmentConfirmAt(appt.date) ? "upcoming" : "confirmed";
}

function canCancelScheduledAppointment(appt, now = new Date()) {
  return Boolean(appt) && getAppointmentStatus(appt, now) === "upcoming";
}

function canJoinScheduledAppointment(appt, now = new Date()) {
  if (!appt || appt.cancelled || appt.joined) return false;
  const start = appointmentStartAt(appt);
  const nowMs = now.getTime();
  return nowMs >= start - 10 * 60000 && nowMs <= start + 10 * 60000;
}

// Heure d'un créneau (défini en heure d'Algérie) affichée dans le fuseau local du visiteur.
function formatLocalTime(dateKey, time, locale = "fr-FR") {
  if (!dateKey || !time) return time || "—";
  return coachSlotInstant(dateKey, time).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

// Plage horaire début-fin d'un créneau, en heure locale du visiteur.
function formatLocalSlotRange(dateKey, time, locale = "fr-FR") {
  return `${formatLocalTime(dateKey, time, locale)}-${formatLocalTime(
    dateKey,
    addMinutesToTime(time, coachSlotDurationMin),
    locale
  )}`;
}

// Étiquette du fuseau local du visiteur, ex. "(GMT+1)".
function localGmtLabel() {
  const h = -Math.round(new Date().getTimezoneOffset() / 60);
  return `(GMT${h >= 0 ? "+" : ""}${h})`;
}

function slotsForDateKey(key) {
  if (!key) return [];
  const weekday = new Date(`${key}T00:00:00`).getDay();
  return coachWeeklyAvailability[weekday] || [];
}

const coachPrograms = [
  {
    id: "free-starter",
    number: "PRG-001",
    name: "Programme de démarrage",
    sentDate: "2026-06-08",
    remark: "Commence par celui-ci pour poser de bonnes bases.",
    priceType: "Gratuit"
  },
  {
    id: "free-mobility",
    number: "PRG-002",
    name: "Routine mobilité quotidienne",
    sentDate: "2026-06-11",
    remark: "À faire chaque matin, 10 minutes suffisent.",
    priceType: "Gratuit"
  },
  {
    id: "fat-loss-program",
    number: "PRG-003",
    name: "Programme Perte de gras",
    sentDate: "2026-06-14",
    remark: "Programme premium — accessible après paiement.",
    priceType: "Payant"
  },
  {
    id: "ebook-strength",
    number: "PRG-004",
    name: "Ebook Force et technique",
    sentDate: "2026-06-16",
    remark: "Disponible une fois acheté dans la boutique.",
    priceType: "Payant"
  },
  {
    id: "coaching-pack",
    number: "PRG-005",
    name: "Pack coaching transformation",
    sentDate: "2026-06-18",
    remark: "Débloqué dès que le pack est réglé.",
    priceType: "Payant"
  },
  {
    id: "mass-gain-plan",
    number: "PRG-006",
    name: "Plan Prise de masse",
    sentDate: "2026-06-19",
    remark: "Programme premium — accessible après paiement.",
    priceType: "Payant"
  },
  {
    id: "hiit-burn",
    number: "PRG-007",
    name: "Programme HIIT brûle-graisse",
    sentDate: "2026-06-20",
    remark: "Réglez le programme pour le débloquer.",
    priceType: "Payant"
  },
  {
    id: "nutrition-advanced",
    number: "PRG-008",
    name: "Ebook Nutrition avancée",
    sentDate: "2026-06-21",
    remark: "Disponible une fois acheté dans la boutique.",
    priceType: "Payant"
  }
];

function formatPrice(eurValue) {
  return eurValue === 0 ? `DZD` : `${eurValue} €`;
}

function addShopNotification(text) {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem("hm-shop-notifications");
    const parsed = saved ? JSON.parse(saved) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    const next = [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, date: new Date().toISOString(), read: false },
      ...list
    ];
    window.localStorage.setItem("hm-shop-notifications", JSON.stringify(next));
    window.dispatchEvent(new Event("hm-notifications-changed"));
  } catch {
    /* ignore storage errors */
  }
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateInvoicePdf({ items, total, customerName, customerEmail, invoiceNumber, dateStr }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightX = pageWidth - 40;

  try {
    const logo = await loadImageElement(hmLogo);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(40, 32, 52, 52, 10, 10, "F");
    doc.addImage(logo, "PNG", 46, 38, 40, 40);
  } catch {
    /* logo optionnel */
  }

  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Hicham Fit App", 102, 56);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Coaching sportif & nutrition", 102, 72);

  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FACTURE", rightX, 56, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`N° ${invoiceNumber}`, rightX, 72, { align: "right" });
  doc.text(`Date : ${dateStr}`, rightX, 86, { align: "right" });

  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Facturé à :", 40, 124);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text(customerName || "Client", 40, 140);
  if (customerEmail) doc.text(customerEmail, 40, 154);

  autoTable(doc, {
    startY: 178,
    head: [["Catégorie", "Programme", "Prix unitaire"]],
    body: items.map((item) => [
      item.category,
      item.title,
      item.priceValue != null ? `${item.priceValue} €` : item.price
    ]),
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [20, 184, 111], textColor: 255, fontStyle: "bold" },
    columnStyles: { 2: { halign: "right" } },
    theme: "grid"
  });

  const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 178;
  doc.setDrawColor(220);
  doc.line(40, finalY + 16, rightX, finalY + 16);
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total : ${total} €`, rightX, finalY + 38, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Merci pour votre confiance — Hicham Fit App", 40, doc.internal.pageSize.getHeight() - 40);

  doc.save(`facture-${invoiceNumber}.pdf`);
  return doc.output("datauristring");
}

// ===== Composant lecteur vocal (beau design messenger) =====
function VoicePlayer({ src, isMine }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s) => { const m = Math.floor((s || 0) / 60); const sec = Math.floor((s || 0) % 60); return `${m}:${sec.toString().padStart(2, "0")}`; };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  };

  // Barres de forme d'onde (hauteurs fixes simulées)
  const bars = [3,5,8,6,11,7,9,4,8,6,10,5,7,9,6,8,4,3,6,9,7,5,8,6,4,3,7,9,5,8];

  return (
    <div className={`flex items-center gap-2.5 w-56 select-none`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => { const a = audioRef.current; if (!a) return; setCurrentTime(a.currentTime); setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0); }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0; }}
      />
      {/* Bouton play/pause */}
      <button
        type="button"
        onClick={toggle}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition shadow-sm ${
          isMine ? "bg-white/25 hover:bg-white/40 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"
        }`}
      >
        {playing
          ? <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" style={{marginLeft:1}}><path d="M8 5v14l11-7z"/></svg>
        }
      </button>

      {/* Zone waveform + temps */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* Barres cliquables */}
        <div
          className="flex items-end gap-[2px] h-8 cursor-pointer"
          onClick={seek}
          role="slider"
          aria-label="Progression audio"
        >
          {bars.map((h, i) => {
            const filled = (i / bars.length) * 100 < progress;
            return (
              <div
                key={i}
                className={`rounded-full transition-colors flex-1 ${
                  filled
                    ? isMine ? "bg-white" : "bg-brand-500"
                    : isMine ? "bg-white/35" : "bg-slate-300"
                } ${playing && filled ? "animate-pulse" : ""}`}
                style={{ height: `${Math.max(3, h * 2.2)}px` }}
              />
            );
          })}
        </div>
        {/* Temps */}
        <span className={`text-[10px] font-bold tabular-nums ${isMine ? "text-white/70" : "text-slate-400"}`}>
          {playing || currentTime > 0 ? fmt(currentTime) : duration > 0 ? fmt(duration) : "0:00"}
        </span>
      </div>

      {/* Icône micro */}
      <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 ${isMine ? "text-white/60" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4M8 23h8"/>
      </svg>
    </div>
  );
}

// Inbox du coach (thème clair) rendue dans le drawer « Ma messagerie » de la barre du haut.
function CoachChatInbox({ onUnread }) {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeName, setActiveName] = useState("");
  const [activeAvatar, setActiveAvatar] = useState("");
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const chatImageInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const endRef = useRef(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [activeReactionId, setActiveReactionId] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const loadConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = await getHmToken();
      if (!token) { setDebugInfo("❌ Pas de token ! Session expirée ?"); if (!silent) setLoading(false); return; }
      setDebugInfo("⏳ Chargement...");
      const list = await fetchCoachConversations(token);
      setDebugInfo("✅ " + list.length + " conversation(s) trouvée(s)");
      setConversations(list);
      if (typeof onUnread === "function") onUnread(list.reduce((s, c) => s + (Number(c.unread) || 0), 0));
    } catch (e) {
      setDebugInfo("❌ Erreur: " + (e.message || "inconnue"));
      console.error("[CHAT-ERROR] loadConversations failed:", e);
    } finally { if (!silent) setLoading(false); }
  };
  useEffect(() => { loadConversations(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: "end" }); }, [thread, activeId]);

  // Temps réel (WebSocket) : à chaque nouveau message, on rafraîchit la liste + le fil ouvert.
  const activeIdRef = useRef(null);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => {
    let unsub = () => {};
    let reconnectTimer = null;
    const connect = async () => {
      const token = await getHmToken();
      if (!token) return;
      unsub();
      unsub = subscribeToMessagesChannel(token, async (row) => {
        loadConversations(true);
        if (activeIdRef.current && row?.athlete_id === activeIdRef.current) {
          const t = await getHmToken();
          if (t) { try { const m = await fetchMessageThread({ accessToken: t, athleteId: activeIdRef.current }); setThread(m); } catch { /* ignore */ } }
        }
      }, () => { reconnectTimer = setTimeout(connect, 3000); });
    };
    connect();
    return () => { if (reconnectTimer) clearTimeout(reconnectTimer); unsub(); };
    // eslint-disable-next-line
  }, []);

  // Filet de sécurité : rafraîchissement discret toutes les 2 s.
  useEffect(() => {
    const iv = setInterval(async () => {
      const token = await getHmToken();
      if (!token) return;
      if (activeId) {
        try {
          const m = await fetchMessageThread({ accessToken: token, athleteId: activeId });
          setThread((prev) => {
            const prevLastId = prev.length ? prev[prev.length - 1]?.id : null;
            const newLastId = m.length ? m[m.length - 1]?.id : null;
            if (prevLastId !== newLastId || prev.length !== m.length) {
              console.log("[CHAT] Thread mis à jour:", m.length, "messages (dernier:", m[m.length - 1]?.body?.slice(0, 30), ")");
              return m;
            }
            return prev;
          });
        } catch { /* ignore */ }
      } else {
        loadConversations(true);
      }
    }, 2000);
    return () => clearInterval(iv);
    // eslint-disable-next-line
  }, [activeId]);

  const openConversation = async (conv) => {
    setActiveId(conv.athlete_id); setActiveName(conv.athlete_name); setActiveAvatar(conv.athlete_avatar); setThreadLoading(true); setThread([]);
    try {
      const token = await getHmToken();
      if (!token) return;
      const msgs = await fetchMessageThread({ accessToken: token, athleteId: conv.athlete_id });
      setThread(msgs);
      setConversations((prev) => prev.map((c) => (c.athlete_id === conv.athlete_id ? { ...c, unread: 0 } : c)));
      if (typeof onUnread === "function") onUnread((p) => Math.max(0, (Number(p) || 0) - (Number(conv.unread) || 0)));
    } catch { /* ignore */ } finally { setThreadLoading(false); }
  };
  const backToList = () => { setActiveId(null); setThread([]); loadConversations(true); };
  
  const sendReply = async (message) => {
    if (!activeId) return;
    setSending(true);
    try {
      const token = await getHmToken();
      if (!token) return;
      
      let body = "";
      let kind = message?.type || "text";

      if (kind === "text") {
        body = message?.text?.trim() || reply.trim();
        if (!body) { setSending(false); return; }
      } else if (message.dataUrl) {
        const url = await uploadChatMedia(token, message.dataUrl, kind, message.fileName);
        body = url || (kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim());
      } else {
        body = kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim();
      }

      if (body) {
        const msg = await sendBackendMessage({ accessToken: token, athleteId: activeId, body, kind });
        if (msg) setThread((prev) => [...prev, msg]);
        if (kind === "text" && (!message || !message.text)) setReply("");
        setConversations((prev) => prev.map((c) => (c.athlete_id === activeId ? { ...c, last_message: body, last_kind: kind, last_sender: "coach", last_at: new Date().toISOString() } : c)));
      }
    } catch (e) {
      alert("Erreur lors de l'envoi : " + (e.message || "Erreur inconnue"));
    } finally { setSending(false); }
  };

  const handleEditMessage = async (msgId, newText) => {
    try {
      const token = await getHmToken();
      if (!token) return;
      const success = await editBackendMessage({ accessToken: token, messageId: msgId, body: newText });
      if (success) {
        setThread((prev) => prev.map((m) => m.id === msgId ? { ...m, body: newText, edited_at: new Date().toISOString() } : m));
        setEditingMsg(null);
      }
    } catch { alert("Erreur lors de la modification"); }
  };
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      const token = await getHmToken();
      if (!token) return;
      const success = await deleteBackendMessage({ accessToken: token, messageId: msgId });
      if (success) {
        setThread((prev) => prev.map((m) => m.id === msgId ? { ...m, deleted_at: new Date().toISOString() } : m));
      }
    } catch { alert("Erreur lors de la suppression"); }
  };
  const handleReactMessage = async (msgId, reaction) => {
    try {
      const token = await getHmToken();
      if (!token) return;
      setThread((prev) => prev.map((m) => {
        if (m.id === msgId) {
          const newReactions = { ...(m.reactions || {}) };
          if (reaction) newReactions.coach = reaction;
          else delete newReactions.coach;
          return { ...m, reactions: newReactions };
        }
        return m;
      }));
      setActiveReactionId(null);
      await reactBackendMessage({ accessToken: token, messageId: msgId, reaction });
    } catch { /* ignore */ }
  };

  const handleChatFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith("image/");
      sendReply({ type: isImage ? "image" : "file", dataUrl: String(reader.result), fileName: file.name });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const startChatRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || typeof MediaRecorder === "undefined") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        if (recorder.__hmCancel) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => sendReply({ type: "voice", dataUrl: String(reader.result) });
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopChatRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  const cancelChatRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.__hmCancel = true;
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    const list = conversations.filter((c) => {
      if (q && !String(c.athlete_name || "").toLowerCase().includes(q)) return false;
      if (readFilter === "unread" && !(c.unread > 0)) return false;
      if (readFilter === "read" && c.unread > 0) return false;
      const ts = new Date(c.last_at).getTime();
      if (fromTs != null && Number.isFinite(ts) && ts < fromTs) return false;
      if (toTs != null && Number.isFinite(ts) && ts > toTs) return false;
      return true;
    });
    list.sort((a, b) => { const da = new Date(a.last_at).getTime(); const db = new Date(b.last_at).getTime(); return sort === "recent" ? db - da : da - db; });
    return list;
  }, [conversations, search, readFilter, sort, dateFrom, dateTo]);

  const fmtWhen = (iso) => { try { return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
  const preview = (c) => {
    const prefix = c.last_sender === "coach" ? "Vous : " : "";
    const body = c.last_kind && c.last_kind !== "text" ? `[${c.last_kind === "image" ? "Image" : c.last_kind === "voice" ? "Vocal" : "Fichier"}]` : c.last_message;
    return `${prefix}${body || ""}`;
  };
  const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400";

  // ----- Vue conversation -----
  if (activeId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button type="button" onClick={backToList} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-400 hover:text-slate-900" aria-label="Retour">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18 9 12l6-6" /></svg>
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-black text-white shadow">
            {activeAvatar ? <img src={activeAvatar} alt="" className="h-full w-full object-cover" /> : getInitials(activeName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-black text-slate-900">{activeName}</p>
            <p className="text-[11px] font-semibold text-emerald-500">● En ligne</p>
            <p className="text-[10px] font-mono text-orange-500">[DEBUG] {thread.length} msgs | dernier: {thread.length ? `[${thread[thread.length-1]?.sender}] ${(thread[thread.length-1]?.body || "").slice(0,25)}` : "vide"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-4" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)", backgroundSize: "24px 24px" }}>
          {threadLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
                <p className="text-sm font-semibold text-slate-400">Chargement…</p>
              </div>
            </div>
          ) : thread.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">💬</div>
              <p className="text-sm font-semibold text-slate-400">Aucun message. Commencez la conversation !</p>
            </div>
          ) : (
            <div className="space-y-1">
              {thread.map((m, idx) => {
                const mine = m.sender === "coach";
                const prevM = thread[idx - 1];
                const nextM = thread[idx + 1];
                const sameAsPrev = prevM && prevM.sender === m.sender;
                const sameAsNext = nextM && nextM.sender === m.sender;
                const isLastInGroup = !sameAsNext;
                const timeStr = (() => { try { return new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; } })();

                // Rendu du contenu selon le type
                const isUrl = m.body && (m.body.startsWith("http://") || m.body.startsWith("https://"));
                const isEditing = editingMsg?.id === m.id;
                let bubbleContent;
                if (isEditing) {
                  bubbleContent = (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <textarea autoFocus className="w-full resize-none rounded-xl border border-brand-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none" value={editingMsg.text} onChange={(e) => setEditingMsg({ ...editingMsg, text: e.target.value })} rows={2} />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingMsg(null)} className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700">Annuler</button>
                        <button onClick={() => handleEditMessage(m.id, editingMsg.text)} className="rounded bg-brand-500 px-2 py-1 text-xs font-bold text-white hover:bg-brand-600">Valider</button>
                      </div>
                    </div>
                  );
                } else {
                  if (m.kind === "voice") {
                    bubbleContent = isUrl ? <VoicePlayer src={m.body} isMine={mine} /> : <span className="flex items-center gap-1.5 text-[13px] opacity-80"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4M8 23h8"/></svg> Message vocal</span>;
                  } else if (m.kind === "image") {
                    bubbleContent = isUrl ? <img src={m.body} alt="Image" className="max-h-56 max-w-[240px] rounded-xl object-cover cursor-pointer" onClick={() => window.open(m.body, "_blank")} /> : <span className="flex items-center gap-1.5 text-[13px] opacity-80">📷 Image</span>;
                  } else if (m.kind === "file") {
                    bubbleContent = isUrl ? <a href={m.body} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-[13px] font-semibold underline underline-offset-2 ${mine ? "text-white/90" : "text-brand-600"}`}><svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Télécharger le fichier</a> : <span className="flex items-center gap-1.5 text-[13px] opacity-80">📎 Fichier</span>;
                  } else {
                    bubbleContent = <p className="whitespace-pre-wrap break-words">{m.body}</p>;
                  }
                }

                // Séparateur de date
                const showDate = !prevM || new Date(m.created_at).toDateString() !== new Date(prevM.created_at).toDateString();
                const dateLabel = (() => {
                  try {
                    const d = new Date(m.created_at);
                    const today = new Date();
                    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
                    if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
                    if (d.toDateString() === yesterday.toDateString()) return "Hier";
                    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                  } catch { return ""; }
                })();

                // Pas de padding pour les médias visuels
                const isMedia = m.kind === "voice" || (m.kind === "image" && isUrl);
                const bubblePad = isMedia ? "p-2" : "px-3.5 py-2.5";

                const reactionsList = Object.entries(m.reactions || {});
                const reactionChips = reactionsList.length > 0 ? (
                  <div className={`absolute -bottom-3 ${mine ? "right-2" : "left-2"} flex gap-1 z-10`}>
                    {reactionsList.map(([userKey, emoji]) => (
                      <div key={userKey} className="flex h-5 items-center justify-center rounded-full border border-slate-200 bg-white px-1.5 text-[11px] shadow-sm cursor-pointer hover:bg-slate-50" onClick={() => { if (userKey === "coach") handleReactMessage(m.id, "") }}>
                        {emoji}
                      </div>
                    ))}
                  </div>
                ) : null;
                
                const actionMenu = !isEditing && (
                  <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${mine ? "right-full mr-2" : "left-full ml-2"}`}>
                    <button onClick={() => setActiveReactionId(m.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-brand-500 hover:bg-slate-50">😀</button>
                    {mine && m.kind === "text" && (
                      <button onClick={() => setEditingMsg({ id: m.id, text: m.body })} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-blue-500 hover:bg-slate-50">✏️</button>
                    )}
                    {mine && (
                      <button onClick={() => handleDeleteMessage(m.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-red-500 hover:bg-slate-50">🗑️</button>
                    )}
                  </div>
                );
                
                const reactionPicker = activeReactionId === m.id && (
                  <div className={`absolute z-20 -top-10 ${mine ? "right-0" : "left-0"} flex gap-1 rounded-full bg-white p-1.5 shadow-md border border-slate-200`}>
                    {["👍", "❤️", "😂", "😮", "😢", "💪"].map((emoji) => (
                      <button key={emoji} onClick={() => handleReactMessage(m.id, emoji)} className="flex h-7 w-7 items-center justify-center rounded-full text-lg transition hover:bg-slate-100 hover:scale-110">{emoji}</button>
                    ))}
                  </div>
                );

                if (m.deleted_at) {
                  return (
                    <div key={m.id} className="mb-2">
                      {showDate && (
                        <div className="my-4 flex items-center gap-3">
                          <div className="h-px flex-1 bg-slate-200" />
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-400 shadow-sm border border-slate-200">{dateLabel}</span>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>
                      )}
                      <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"} ${sameAsPrev ? "mt-0.5" : "mt-3"}`}>
                        {!mine && <div className="h-7 w-7 shrink-0 opacity-0" />}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-[12px] italic text-slate-400">
                          🚫 Ce message a été supprimé.
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={m.id} className={`${reactionsList.length > 0 ? "mb-4" : "mb-1"}`}>
                    {showDate && (
                      <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-400 shadow-sm border border-slate-200">{dateLabel}</span>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                    )}
                    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"} ${sameAsPrev ? "mt-0.5" : "mt-3"}`}>
                      {/* Avatar athlète (gauche) */}
                      {!mine && (
                        <div className={`shrink-0 ${isLastInGroup ? "opacity-100" : "opacity-0"}`}>
                          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-black text-white">
                            {activeAvatar ? <img src={activeAvatar} alt="" className="h-full w-full object-cover" /> : getInitials(activeName)}
                          </div>
                        </div>
                      )}

                      {/* Bulle */}
                      <div className="group relative max-w-[75%]">
                        {reactionPicker}
                        {actionMenu}
                        <div className={`
                          ${bubblePad} text-sm leading-relaxed shadow-sm
                          ${mine
                            ? `bg-brand-500 text-white ${sameAsPrev && sameAsNext ? "rounded-2xl rounded-r-md" : sameAsPrev ? "rounded-2xl rounded-tr-md" : sameAsNext ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                            : `bg-white text-slate-800 border border-slate-200 ${sameAsPrev && sameAsNext ? "rounded-2xl rounded-l-md" : sameAsPrev ? "rounded-2xl rounded-tl-md" : sameAsNext ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                          }
                        `}>
                          {bubbleContent}
                          {m.edited_at && <span className="ml-2 text-[10px] opacity-70 italic">(modifié)</span>}
                        </div>
                        {reactionChips}
                      </div>
                    </div>
                    {isLastInGroup && (
                      <p className={`mt-1 text-[10px] font-semibold ${mine ? "text-right text-slate-400 pr-0" : "text-left text-slate-400 pl-9"}`}>{timeStr}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Zone de saisie */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
          {isRecording ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 mb-1">
              <span className="flex items-center gap-2 text-sm font-black text-rose-600"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" /> Enregistrement…</span>
              <div className="flex gap-2">
                <button type="button" onClick={cancelChatRecording} className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100">Annuler</button>
                <button type="button" onClick={stopChatRecording} className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-600">Envoyer</button>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-1.5">
              <button type="button" onClick={() => chatFileInputRef.current && chatFileInputRef.current.click()} title="Joindre un fichier" aria-label="Joindre un fichier" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </button>
              <button type="button" onClick={() => chatImageInputRef.current && chatImageInputRef.current.click()} title="Joindre une photo" aria-label="Joindre une photo" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>
              </button>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                rows={1}
                placeholder={`Répondre à ${activeName}…`}
                className="max-h-28 min-h-[2.25rem] flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white"
              />
              <button type="button" onClick={startChatRecording} title="Message vocal" aria-label="Message vocal" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v4M8 23h8" /></svg>
              </button>
              <button
                type="button"
                onClick={() => sendReply()}
                disabled={sending || !reply.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Envoyer"
              >
                {sending
                  ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>
                }
              </button>
            </div>
          )}
          <input ref={chatFileInputRef} type="file" className="hidden" onChange={handleChatFile} />
          <input ref={chatImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleChatFile} />
        </div>
      </div>


    );
  }

  // ----- Vue liste (inbox) -----
  const totalUnread = conversations.reduce((s, c) => s + (Number(c.unread) || 0), 0);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un athlète…" className={`${inputCls} pl-9`} />
          </div>
          <button type="button" onClick={() => setShowFilters((v) => !v)} className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${showFilters ? "border-brand-400 text-brand-600" : "border-slate-300 text-slate-500 hover:border-brand-400"}`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filtres
          </button>
        </div>
        {showFilters ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)} className={inputCls}>
              <option value="all">Tous</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
              <option value="recent">Plus récent</option>
              <option value="old">Plus ancien</option>
            </select>
            <label className="text-[11px] font-semibold text-slate-500">Du<input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} className={inputCls} /></label>
            <label className="text-[11px] font-semibold text-slate-500">Au<input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className={inputCls} /></label>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-2 py-2">
        {debugInfo && (
          <div className="mb-4 rounded-xl border-2 border-orange-500/20 bg-orange-50 px-3 py-2 text-xs font-mono text-orange-600">
            {debugInfo}
          </div>
        )}
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Chargement…</p>
        ) : conversations.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">Aucun message reçu pour le moment.</p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">Aucune conversation ne correspond à ces filtres.</p>
        ) : (
          filtered.map((c) => {
            const unread = c.unread > 0;
            return (
              <button key={c.athlete_id} type="button" onClick={() => openConversation(c)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${unread ? "bg-brand-50" : "hover:bg-white"}`}>
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-black text-white">
                    {c.athlete_avatar ? <img src={c.athlete_avatar} alt="" className="h-full w-full object-cover" /> : <span>{getInitials(c.athlete_name)}</span>}
                  </div>
                  {unread ? <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate ${unread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>{c.athlete_name}</p>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-400">{fmtWhen(c.last_at)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-xs ${unread ? "text-slate-700" : "text-slate-400"}`}>{preview(c)}</p>
                    {unread ? <span className="shrink-0 rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">{c.unread}</span> : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
      {totalUnread ? <div className="shrink-0 border-t border-slate-200 px-4 py-2 text-center text-[11px] font-bold text-slate-400">{totalUnread} message{totalUnread > 1 ? "s" : ""} non lu{totalUnread > 1 ? "s" : ""}</div> : null}
    </div>
  );
}

function CoachInbox() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [notifFilter, setNotifFilter] = useState("all");
  const [notifSortDesc, setNotifSortDesc] = useState(true);
  const [notifFrom, setNotifFrom] = useState("");
  const [notifTo, setNotifTo] = useState("");
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-notifications");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const chatImageInputRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [reactionPickerId, setReactionPickerId] = useState(null);
  const [coachOnline, setCoachOnline] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const welcome = {
      id: "coach-welcome",
      from: "coach",
      type: "text",
      text: "Bonjour 👋 Pose-moi ta question, je te réponds dès que possible !",
      date: new Date().toISOString(),
      reactions: []
    };
    if (typeof window === "undefined") return [welcome];
    try {
      const saved = window.localStorage.getItem("hm-coach-chat");
      const parsed = saved ? JSON.parse(saved) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.some((message) => message && message.id === "coach-welcome") ? list : [welcome, ...list];
    } catch {
      return [welcome];
    }
  });

  // Point rouge « nouveau message du coach » : basé sur la date de dernière lecture de la messagerie.
  const [lastChatReadAt, setLastChatReadAt] = useState(() => {
    if (typeof window === "undefined") return 0;
    const v = Number(window.localStorage.getItem("hm-coach-chat-read") || 0);
    return Number.isFinite(v) ? v : 0;
  });
  const hasUnreadCoach = chatMessages.some(
    (m) => m && m.from === "coach" && m.id !== "coach-welcome" && new Date(m.date).getTime() > lastChatReadAt
  );
  const markChatRead = () => {
    const t = Date.now();
    setLastChatReadAt(t);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("hm-coach-chat-read", String(t)); } catch { /* ignore */ }
    }
  };
  const openChat = () => { markChatRead(); setIsChatOpen(true); };

  useEffect(() => {
    const computeCoachOnline = () => {
      const hour = new Date().getHours();
      setCoachOnline(hour >= 8 && hour < 22);
    };
    computeCoachOnline();
    const interval = setInterval(computeCoachOnline, 60000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const reloadNotifications = () => {
      try {
        const saved = window.localStorage.getItem("hm-shop-notifications");
        const parsed = saved ? JSON.parse(saved) : [];
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } catch {
        /* ignore storage errors */
      }
    };
    window.addEventListener("hm-notifications-changed", reloadNotifications);
    window.addEventListener("storage", reloadNotifications);
    return () => {
      window.removeEventListener("hm-notifications-changed", reloadNotifications);
      window.removeEventListener("storage", reloadNotifications);
    };
  }, []);

  const persistNotifications = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-shop-notifications", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
    return next;
  };
  const markAllNotificationsRead = () =>
    setNotifications((current) => persistNotifications(current.map((item) => ({ ...item, read: true }))));
  const toggleNotificationRead = (id) =>
    setNotifications((current) =>
      persistNotifications(current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
    );
  const toggleSelectNotif = (id) =>
    setSelectedNotifs((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  const deleteSelectedNotifs = () => {
    setNotifications((current) => persistNotifications(current.filter((item) => !selectedNotifs.includes(item.id))));
    setSelectedNotifs([]);
  };
  const markSelectedNotifsRead = () => {
    setNotifications((current) =>
      persistNotifications(current.map((item) => (selectedNotifs.includes(item.id) ? { ...item, read: true } : item)))
    );
    setSelectedNotifs([]);
  };
  const deleteNotification = (id) => {
    setNotifications((current) => persistNotifications(current.filter((item) => item.id !== id)));
    setSelectedNotifs((current) => current.filter((entry) => entry !== id));
  };
  const clearNotifications = () => {
    setNotifications(persistNotifications([]));
    setSelectedNotifs([]);
  };
  const unreadCount = notifications.filter((item) => !item.read).length;
  const visibleNotifications = notifications
    .filter((item) => notifFilter === "all" || (notifFilter === "unread" ? !item.read : item.read))
    .filter((item) => {
      if (!notifFrom && !notifTo) return true;
      const time = new Date(item.date).getTime();
      if (notifFrom && time < new Date(`${notifFrom}T00:00:00`).getTime()) return false;
      if (notifTo && time > new Date(`${notifTo}T23:59:59`).getTime()) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return notifSortDesc ? db - da : da - db;
    });
  const allVisibleNotifsSelected =
    visibleNotifications.length > 0 && visibleNotifications.every((item) => selectedNotifs.includes(item.id));
  const toggleSelectAllVisibleNotifs = () =>
    setSelectedNotifs(allVisibleNotifsSelected ? [] : visibleNotifications.map((item) => item.id));

  const persistChat = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-coach-chat", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
    return next;
  };
  const pushChatMessage = (message) => {
    const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setChatMessages((current) =>
      persistChat([
        ...current,
        { id: localId, date: new Date().toISOString(), from: "user", ...message }
      ])
    );
    // Envoi au backend (texte direct ; médias uploadés vers Storage puis URL envoyée).
    if (!__hmIsCoach) {
      const kind = message.type === "image" ? "image" : message.type === "voice" ? "voice" : message.type === "file" ? "file" : "text";
      (async () => {
        const token = await getHmToken();
        if (!token) return;
        let body;
        if (kind === "text") {
          body = String(message.text || "").trim();
        } else if (message.dataUrl) {
          // Upload Storage
          const url = await uploadChatMedia(token, message.dataUrl, kind, message.fileName);
          body = url || (kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim());
        } else {
          body = kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim();
        }
        if (body) { 
          try { 
            const bMsg = await sendBackendMessage({ accessToken: token, body, kind }); 
            if (bMsg && bMsg.id) {
              setChatMessages((curr) => persistChat(curr.map(m => m.id === localId ? { ...m, backendId: bMsg.id } : m)));
            }
          } catch (e) { 
            alert("Erreur d'envoi : " + (e.message || "Erreur inconnue")); 
          } 
        }
      })();
    }
  };
  // Récupère les réponses du coach : temps réel (WebSocket) + filet de sécurité toutes les 4 s.
  useEffect(() => {
    if (__hmIsCoach) return;
    let cancelled = false;
    const pull = async () => {
      const token = await getHmToken();
      if (!token || cancelled) return;
      try {
        const msgs = await fetchMessageThread({ accessToken: token });
        if (cancelled) return;
        setChatMessages((current) => {
          const existing = new Set(current.map((m) => m.backendId).filter(Boolean));
          const toAdd = msgs
            .filter((m) => !existing.has(m.id) && !m.deleted_at)
            .map((m) => {
              const kind = m.kind || "text";
              const isMedia = ["voice", "image", "file"].includes(kind);
              let athleteReaction = "";
              if (m.reactions && m.reactions.athlete) athleteReaction = m.reactions.athlete;
              return { 
                id: `srv-${m.id}`, 
                backendId: m.id, 
                from: m.sender === "coach" ? "coach" : "user", 
                type: kind === "voice" || kind === "image" || kind === "file" ? kind : "text", 
                text: isMedia ? "" : m.body, 
                dataUrl: isMedia ? m.body : undefined,
                fileName: kind === "file" ? "Document" : undefined,
                date: m.created_at, 
                reactions: athleteReaction ? [athleteReaction] : [],
                edited: !!m.edited_at
              };
            });
          if (!toAdd.length) return current;
          const merged = [...current, ...toAdd].sort((a, b) => new Date(a.date) - new Date(b.date));
          return persistChat(merged);
        });
      } catch { /* ignore */ }
    };
    pull();
    // Temps réel : dès qu'un message arrive dans MA conversation (RLS), on rafraîchit.
    let unsub = () => {};
    let reconnectTimer = null;
    const connect = async () => {
      const token = await getHmToken();
      if (!token || cancelled) return;
      unsub();
      unsub = subscribeToMessagesChannel(token, (row) => { if (row?.sender === "coach") pull(); }, () => {
        if (!cancelled) reconnectTimer = setTimeout(connect, 3000);
      });
    };
    connect();
    const interval = setInterval(pull, 2000);
    return () => { cancelled = true; clearInterval(interval); if (reconnectTimer) clearTimeout(reconnectTimer); unsub(); };
  }, []);
  const sendChatText = () => {
    const text = chatText.trim();
    if (!text) return;
    pushChatMessage({ type: "text", text });
    setChatText("");
  };
  const handleChatFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith("image/");
      pushChatMessage({ type: isImage ? "image" : "file", dataUrl: String(reader.result), fileName: file.name });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const startChatRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || typeof MediaRecorder === "undefined") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        if (recorder.__hmCancel) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => pushChatMessage({ type: "voice", dataUrl: String(reader.result) });
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };
  const stopChatRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  const cancelChatRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.__hmCancel = true;
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  const deleteChatMessage = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    const msg = chatMessages.find(m => m.id === id);
    if (msg?.backendId) {
      try {
        const token = await getHmToken();
        if (token) await deleteBackendMessage({ accessToken: token, messageId: msg.backendId });
      } catch { /* ignore */ }
    }
    setChatMessages((current) => persistChat(current.filter((m) => m.id !== id)));
  };
  const startEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingText(message.text || "");
  };
  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText("");
  };
  const saveEditMessage = async () => {
    const text = editingText.trim();
    if (!text) return;
    const msg = chatMessages.find(m => m.id === editingMessageId);
    if (msg?.backendId) {
      try {
        const token = await getHmToken();
        if (token) await editBackendMessage({ accessToken: token, messageId: msg.backendId, body: text });
      } catch { /* ignore */ }
    }
    setChatMessages((current) =>
      persistChat(current.map((m) => (m.id === editingMessageId ? { ...m, text, edited: true } : m)))
    );
    setEditingMessageId(null);
    setEditingText("");
  };
  const toggleChatReaction = async (id, emoji) => {
    const msg = chatMessages.find(m => m.id === id);
    let newEmoji = "";
    setChatMessages((current) =>
      persistChat(
        current.map((m) => {
          if (m.id !== id) return m;
          const reactions = Array.isArray(m.reactions) ? m.reactions : [];
          newEmoji = reactions.includes(emoji) ? "" : emoji;
          return { ...m, reactions: newEmoji ? [newEmoji] : [] };
        })
      )
    );
    setReactionPickerId(null);
    if (msg?.backendId) {
      try {
        const token = await getHmToken();
        if (token) await reactBackendMessage({ accessToken: token, messageId: msg.backendId, reaction: newEmoji });
      } catch { /* ignore */ }
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsNotifOpen(true)} className="settings-hero__action" aria-label="Notifications" title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
      <button type="button" onClick={openChat} className="settings-hero__action relative" aria-label="Messagerie" title="Messagerie">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
        {hasUnreadCoach ? (
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5" aria-label="Nouveau message">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" />
          </span>
        ) : null}
      </button>

      {isNotifOpen && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            onClick={() => setIsNotifOpen(false)}
          >
            <div className="flex max-h-[85vh] w-[min(100%,34rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-500" aria-hidden="true">
                    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>
                  <h2 className="font-display text-lg font-black text-slate-900">Notifications</h2>
                  {unreadCount > 0 ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">{unreadCount}</span> : null}
                </div>
                <button type="button" onClick={() => setIsNotifOpen(false)} aria-label="Fermer" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {notifications.length ? (
                <div className="shrink-0 border-b border-slate-200 px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[["all", "Tous"], ["unread", "Non lus"], ["read", "Lus"]].map(([value, label]) => (
                        <button key={value} type="button" onClick={() => setNotifFilter(value)} className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${notifFilter === value ? "bg-brand-400 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>
                      ))}
                    </div>
                    <button type="button" onClick={markAllNotificationsRead} disabled={unreadCount === 0} className="ml-auto rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50">Tout lu</button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <button type="button" onClick={() => setNotifSortDesc(true)} className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${notifSortDesc ? "bg-brand-400 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Plus récents</button>
                    <button type="button" onClick={() => setNotifSortDesc(false)} className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${!notifSortDesc ? "bg-brand-400 text-slate-950" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Plus anciens</button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Du</span>
                    <input type="date" value={notifFrom} max={notifTo || undefined} onChange={(event) => setNotifFrom(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-400" />
                    <span className="text-xs font-bold text-slate-500">au</span>
                    <input type="date" value={notifTo} min={notifFrom || undefined} onChange={(event) => setNotifTo(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-400" />
                    {notifFrom || notifTo ? (
                      <button type="button" onClick={() => { setNotifFrom(""); setNotifTo(""); }} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200">Effacer dates</button>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button type="button" onClick={toggleSelectAllVisibleNotifs} className="flex items-center gap-1.5 text-xs font-black text-slate-600 transition hover:text-slate-900">
                      <span className={`flex h-4 w-4 items-center justify-center rounded border-2 ${allVisibleNotifsSelected ? "border-rose-500 bg-rose-500 text-white" : "border-slate-300 text-transparent"}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      </span>
                      Tout sélectionner
                    </button>
                    {selectedNotifs.length ? <span className="text-xs font-bold text-slate-500">{selectedNotifs.length} sélectionnée(s)</span> : null}
                  </div>
                </div>
              ) : null}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {visibleNotifications.length ? (
                  <ul className="space-y-3">
                    {visibleNotifications.map((item) => {
                      const selected = selectedNotifs.includes(item.id);
                      return (
                        <li key={item.id} className={`flex items-start gap-3 rounded-2xl border p-3 transition ${selected ? "border-rose-300 bg-rose-50" : item.read ? "border-slate-200 bg-white" : "border-brand-300 bg-brand-50"}`}>
                          <button type="button" onClick={() => toggleSelectNotif(item.id)} aria-pressed={selected} aria-label="Sélectionner" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${selected ? "border-rose-500 bg-rose-500 text-white" : "border-slate-300 text-transparent hover:border-slate-400"}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${item.read ? "font-medium text-slate-600" : "font-bold text-slate-900"}`}>{item.text}</p>
                            <p className="mt-1 text-xs text-slate-400">{new Date(item.date).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <div className="mt-0.5 flex shrink-0 items-center gap-1">
                            <button type="button" onClick={() => toggleNotificationRead(item.id)} title={item.read ? "Marquer comme non lu" : "Marquer comme lu"} aria-label={item.read ? "Marquer comme non lu" : "Marquer comme lu"} className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-wide transition ${item.read ? "border-slate-300 text-slate-500 hover:border-slate-400" : "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100"}`}>
                              {item.read ? "Lu" : "Non lu"}
                            </button>
                            <button type="button" onClick={() => deleteNotification(item.id)} title="Supprimer" aria-label="Supprimer la notification" className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-400 hover:text-rose-500">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-display text-lg font-black text-slate-900">{notifications.length ? "Aucune notification dans ce filtre" : "Aucune notification"}</p>
                    <p className="mt-2 text-sm text-slate-500">Vos notifications d'achat apparaîtront ici.</p>
                  </div>
                )}
              </div>

              {notifications.length ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-200 px-5 py-4">
                  {selectedNotifs.length ? (
                    <button type="button" onClick={markSelectedNotifsRead} className="flex-1 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-black text-brand-700 transition hover:bg-brand-100">Marquer lu ({selectedNotifs.length})</button>
                  ) : null}
                  {selectedNotifs.length ? (
                    <button type="button" onClick={deleteSelectedNotifs} className="flex-1 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-black text-rose-600 transition hover:bg-rose-100">Supprimer ({selectedNotifs.length})</button>
                  ) : null}
                  <button type="button" onClick={clearNotifications} className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-rose-400 hover:text-rose-600">Tout effacer</button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
        : null}

      {isChatOpen && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Messagerie avec Coach Hicham"
            onClick={() => { stopChatRecording(); setIsChatOpen(false); }}
          >
            <div className="flex h-[80vh] max-h-[640px] w-[min(100%,32rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  {__hmIsCoach ? (
                    <>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1Z" /><path d="m4.5 6.5 7.5 5 7.5-5" /></svg>
                      </span>
                      <h2 className="font-display text-base font-black text-slate-900">Ma messagerie</h2>
                    </>
                  ) : (
                    <>
                      <img src={coachHero} alt="Coach Hicham" className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <h2 className="font-display text-base font-black text-slate-900">Coach Hicham</h2>
                        <p className={`flex items-center gap-1.5 text-xs font-bold ${coachOnline ? "text-brand-600" : "text-rose-500"}`}>
                          <span className={`h-2 w-2 rounded-full ${coachOnline ? "bg-brand-500" : "bg-rose-500"}`} />
                          {coachOnline ? "En ligne" : "Hors ligne"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button type="button" onClick={() => { stopChatRecording(); setIsChatOpen(false); }} aria-label="Fermer" className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {__hmIsCoach ? (
                <CoachChatInbox />
              ) : (
              <>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
                {chatMessages.map((message) => {
                  const isCoach = message.from === "coach";
                  if (message.deleted) {
                    return (
                      <div key={message.id} className={`flex flex-col gap-1 ${isCoach ? "items-start" : "items-end"}`}>
                        <div className={`flex max-w-[90%] items-end gap-1.5`}>
                          {isCoach && <div className="h-7 w-7 shrink-0" />}
                          <div className={`rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-[12px] italic text-slate-400 ${isCoach ? "rounded-bl-sm" : "rounded-br-sm"}`}>
                            🚫 Ce message a été supprimé.
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const isEditing = editingMessageId === message.id;
                  const reactions = Array.isArray(message.reactions) ? message.reactions : [];
                  const actionButtons = (
                    <div className="flex items-center gap-0.5">
                      <button type="button" onClick={() => setReactionPickerId((current) => (current === message.id ? null : message.id))} title="Réagir" aria-label="Réagir" className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition hover:bg-slate-200 hover:text-slate-700 ${reactions.length > 0 ? "bg-slate-200" : "text-slate-400"}`}>
                        {reactions.length > 0 ? reactions[0] : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></svg>}
                      </button>
                      {!isCoach && message.type === "text" ? (
                        <button type="button" onClick={() => startEditMessage(message)} title="Modifier" aria-label="Modifier" className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                        </button>
                      ) : null}
                      {!isCoach ? (
                        <button type="button" onClick={() => deleteChatMessage(message.id)} title="Supprimer" aria-label="Supprimer" className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-100 hover:text-rose-500">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                        </button>
                      ) : null}
                    </div>
                  );
                  const CHAT_EMOJIS = ["👍","👎","❤️","🔥","😂","😮","😢","😡","💪","🎉","🙏","👏","😍","🤔","💯","🥇","😎","🏆","✅","⚡","💥","🤩","😴","🤣","🫶"];
                  const picker = reactionPickerId === message.id ? (
                    <div className="flex max-w-[16rem] flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
                      {CHAT_EMOJIS.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => toggleChatReaction(message.id, emoji)} className={`text-base transition hover:scale-125 rounded-full p-0.5 ${reactions.includes(emoji) ? "bg-brand-100 ring-1 ring-brand-400" : ""}`}>{emoji}</button>
                      ))}
                    </div>
                  ) : null;
                  const reactionChips = reactions.length ? (
                    <div className={`flex flex-wrap gap-1 ${isCoach ? "justify-start pl-9" : "justify-end"}`}>
                      {reactions.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => toggleChatReaction(message.id, emoji)} className="rounded-full border border-brand-300 bg-brand-50 px-2 py-0.5 text-xs shadow-sm font-bold text-slate-700 hover:bg-brand-100 transition">{emoji}</button>
                      ))}
                    </div>
                  ) : null;
                  const timeLine = (
                    <p className={`mt-1 flex items-center gap-1 text-[10px] ${isCoach ? "justify-start text-slate-400" : "justify-end text-slate-900/60"}`}>
                      {message.edited ? <span>(modifié)</span> : null}
                      {new Date(message.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  );
                  const bubbleInner = isEditing ? (
                    <div className="w-56">
                      <textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} rows={2} className="w-full resize-none rounded-xl border border-brand-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none" />
                      <div className="mt-1 flex justify-end gap-1">
                        <button type="button" onClick={cancelEditMessage} className="rounded-lg bg-white/70 px-2 py-1 text-xs font-black text-slate-700">Annuler</button>
                        <button type="button" onClick={saveEditMessage} className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-black text-white">Enregistrer</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.type === "text" ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : null}
                      {message.type === "image" ? <img src={message.dataUrl} alt={message.fileName || "image"} className="max-h-52 rounded-xl" /> : null}
                      {message.type === "voice" ? <VoicePlayer src={message.dataUrl} isMine={!isCoach} /> : null}
                      {message.type === "file" ? (
                        <a href={message.dataUrl} download={message.fileName} className="flex items-center gap-2 font-bold underline">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                          {message.fileName}
                        </a>
                      ) : null}
                      {timeLine}
                    </>
                  );
                  if (isCoach) {
                    return (
                      <div key={message.id} className="flex flex-col items-start gap-1">
                        <div className="flex max-w-[90%] items-end gap-1.5">
                          <img src={coachHero} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                          <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{bubbleInner}</div>
                          {actionButtons}
                        </div>
                        {picker}
                        {reactionChips}
                      </div>
                    );
                  }
                  return (
                    <div key={message.id} className="flex flex-col items-end gap-1">
                      <div className="flex max-w-[90%] items-center gap-1.5">
                        {actionButtons}
                        <div className="rounded-2xl rounded-br-sm bg-brand-400 px-3 py-2 text-sm text-slate-950">{bubbleInner}</div>
                      </div>
                      {picker}
                      {reactionChips}
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 border-t border-slate-200 px-3 py-3">
                {isRecording ? (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-black text-rose-600"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" /> Enregistrement…</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={cancelChatRecording} className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100">Annuler</button>
                      <button type="button" onClick={stopChatRecording} className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-600">Envoyer</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end gap-1.5">
                    <button type="button" onClick={() => chatFileInputRef.current && chatFileInputRef.current.click()} title="Joindre un fichier" aria-label="Joindre un fichier" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                    </button>
                    <button type="button" onClick={() => chatImageInputRef.current && chatImageInputRef.current.click()} title="Joindre une photo" aria-label="Joindre une photo" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>
                    </button>
                    <textarea value={chatText} onChange={(event) => setChatText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendChatText(); } }} rows={1} placeholder="Écrire un message..." className="max-h-28 min-h-[2.25rem] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400" />
                    <button type="button" onClick={startChatRecording} title="Message vocal" aria-label="Message vocal" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v4M8 23h8" /></svg>
                    </button>
                    <button type="button" onClick={sendChatText} disabled={!chatText.trim()} aria-label="Envoyer" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-brand-300 bg-brand-400 text-slate-950 transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>
                    </button>
                  </div>
                )}
                <input ref={chatFileInputRef} type="file" className="hidden" onChange={handleChatFile} />
                <input ref={chatImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleChatFile} />
              </div>
              </>
              )}
            </div>
          </div>,
          document.body
        )
        : null}
    </>
  );
}

// Bibliothèque d'exercices du coach Hicham (démos, exécution, erreurs, variantes).
// Petite bibliothèque FR de repli (utilisée seulement si la base en ligne ne charge pas).
const exerciseLibrary = [
  {
    id: "bench-press", name: "Développé couché", emoji: "🏋️", muscle: "Pectoraux", equipment: "Barre", level: "Intermédiaire",
    targets: ["Pectoraux", "Triceps", "Épaules"], sets: "4 × 8-10",
    steps: ["Allonge-toi sur le banc, pieds au sol, omoplates serrées.", "Saisis la barre un peu plus large que les épaules.", "Descends la barre vers le milieu de la poitrine en contrôlant.", "Pousse jusqu'à l'extension complète sans verrouiller brutalement."],
    mistakes: ["Ne fais pas rebondir la barre sur la poitrine.", "Ne décolle pas les fessiers du banc.", "N'écarte pas trop les coudes (90°)."],
    variants: { easier: "Développé haltères ou à la machine guidée.", harder: "Tempo lent 3s à la descente + pause poitrine." },
  },
  {
    id: "push-up", name: "Pompes", emoji: "🤸", muscle: "Pectoraux", equipment: "Poids du corps", level: "Débutant",
    targets: ["Pectoraux", "Triceps", "Gainage"], sets: "4 × 12-20",
    steps: ["Mains sous les épaules, corps gainé en planche.", "Descends en gardant les coudes à ~45°.", "Frôle le sol puis pousse fort.", "Garde le bassin aligné (pas de creux)."],
    mistakes: ["Ne cambre pas le bas du dos.", "Ne raccourcis pas l'amplitude.", "Ne laisse pas la tête plonger en avant."],
    variants: { easier: "Sur les genoux ou contre un mur.", harder: "Pieds surélevés / lestée / déclinées." },
  },
  {
    id: "squat", name: "Squat", emoji: "🦵", muscle: "Jambes", equipment: "Barre", level: "Intermédiaire",
    targets: ["Quadriceps", "Fessiers", "Ischios"], sets: "4 × 6-10",
    steps: ["Barre sur le haut du dos, pieds largeur épaules.", "Inspire, gaine, descends en poussant les hanches en arrière.", "Descends au moins jusqu'à cuisses parallèles.", "Remonte en poussant dans les talons."],
    mistakes: ["Ne laisse pas les genoux rentrer vers l'intérieur.", "Ne laisse pas le dos s'arrondir.", "Ne laisse pas les talons décoller."],
    variants: { easier: "Squat au poids du corps / box squat.", harder: "Squat avant / tempo / pause basse." },
  },
  {
    id: "lunges", name: "Fentes", emoji: "🦵", muscle: "Jambes", equipment: "Haltères", level: "Débutant",
    targets: ["Quadriceps", "Fessiers"], sets: "3 × 10-12 / jambe",
    steps: ["Un haltère dans chaque main, buste droit.", "Avance d'un grand pas.", "Descends le genou arrière vers le sol.", "Pousse sur la jambe avant pour revenir."],
    mistakes: ["Ne laisse pas le genou avant dépasser la pointe du pied.", "Ne penche pas le buste en avant.", "Ne fais pas un pas trop court."],
    variants: { easier: "Fentes statiques sans charge.", harder: "Fentes marchées / fentes bulgares." },
  },
  {
    id: "deadlift", name: "Soulevé de terre", emoji: "🏋️", muscle: "Dos", equipment: "Barre", level: "Avancé",
    targets: ["Ischios", "Fessiers", "Dos", "Trapèzes"], sets: "4 × 4-6",
    steps: ["Pieds largeur hanches, barre au-dessus du milieu du pied.", "Saisis la barre, dos plat, poitrine haute.", "Pousse dans le sol et tire la barre le long des jambes.", "Verrouille hanches et genoux en haut."],
    mistakes: ["N'arrondis pas le dos.", "Ne laisse pas la barre s'éloigner du corps.", "Ne pars pas en hyperextension en haut."],
    variants: { easier: "Soulevé roumain léger / kettlebell.", harder: "Déficit / tempo contrôlé." },
  },
  {
    id: "pull-up", name: "Tractions", emoji: "💪", muscle: "Dos", equipment: "Poids du corps", level: "Avancé",
    targets: ["Grand dorsal", "Biceps"], sets: "4 × max",
    steps: ["Prise pronation un peu plus large que les épaules.", "Gaine et tire les coudes vers le bas.", "Monte jusqu'à ce que le menton dépasse la barre.", "Descends en contrôlant (pas en chute)."],
    mistakes: ["Ne pars pas en à-coups ni en balancier.", "Ne raccourcis pas l'amplitude.", "Ne laisse pas les épaules désengagées."],
    variants: { easier: "Tractions assistées élastique / tirage vertical.", harder: "Tractions lestées / tempo." },
  },
  {
    id: "db-row", name: "Rowing haltère", emoji: "💪", muscle: "Dos", equipment: "Haltères", level: "Intermédiaire",
    targets: ["Dos", "Biceps"], sets: "4 × 10-12",
    steps: ["Un genou et une main sur le banc, dos plat.", "Haltère bras tendu.", "Tire le coude vers la hanche.", "Contracte le dos puis redescends contrôlé."],
    mistakes: ["Ne tourne pas le buste.", "Ne tire pas avec le bras seul (engage le dos).", "N'arrondis pas le dos."],
    variants: { easier: "Rowing à l'élastique.", harder: "Tempo lent / charge plus lourde." },
  },
  {
    id: "ohp", name: "Développé militaire", emoji: "🏋️", muscle: "Épaules", equipment: "Barre", level: "Intermédiaire",
    targets: ["Épaules", "Triceps"], sets: "4 × 6-10",
    steps: ["Barre au niveau des clavicules, gaine fessiers et abdos.", "Pousse la barre au-dessus de la tête.", "Passe légèrement la tête sous la barre en haut.", "Redescends contrôlé aux clavicules."],
    mistakes: ["Ne cambre pas excessivement.", "Ne pousse pas vers l'avant.", "Ne verrouille pas brutalement."],
    variants: { easier: "Développé haltères assis.", harder: "Strict press / push press." },
  },
  {
    id: "lateral-raise", name: "Élévations latérales", emoji: "💪", muscle: "Épaules", equipment: "Haltères", level: "Débutant",
    targets: ["Deltoïdes latéraux"], sets: "3 × 12-15",
    steps: ["Haltères le long du corps, léger fléchissement des coudes.", "Monte les bras sur les côtés jusqu'à l'horizontale.", "Mène le mouvement avec les coudes.", "Redescends lentement."],
    mistakes: ["N'utilise pas l'élan.", "Ne monte pas au-dessus des épaules.", "Ne mets pas une charge trop lourde."],
    variants: { easier: "Charges légères / un bras à la fois.", harder: "Tempo / série dégressive." },
  },
  {
    id: "biceps-curl", name: "Curl biceps", emoji: "💪", muscle: "Bras", equipment: "Haltères", level: "Débutant",
    targets: ["Biceps"], sets: "3 × 10-12",
    steps: ["Haltères en supination, coudes près du corps.", "Fléchis les avant-bras.", "Contracte en haut.", "Descends en contrôlant."],
    mistakes: ["Ne balance pas le buste.", "Ne bouge pas les coudes.", "Ne raccourcis pas l'amplitude."],
    variants: { easier: "Curl à la barre / assis.", harder: "Tempo lent / curl marteau." },
  },
  {
    id: "dips", name: "Dips", emoji: "🤸", muscle: "Bras", equipment: "Poids du corps", level: "Intermédiaire",
    targets: ["Triceps", "Pectoraux"], sets: "4 × 8-12",
    steps: ["Bras tendus sur les barres parallèles, gaine.", "Descends en pliant les coudes.", "Garde le buste droit pour cibler les triceps.", "Pousse jusqu'à extension."],
    mistakes: ["Ne descends pas trop profond (douleur).", "Ne laisse pas les épaules monter vers les oreilles.", "Ne fais pas d'à-coups."],
    variants: { easier: "Dips sur un banc.", harder: "Dips lestés." },
  },
  {
    id: "plank", name: "Gainage planche", emoji: "🧘", muscle: "Abdos", equipment: "Poids du corps", level: "Débutant",
    targets: ["Abdos", "Gainage"], sets: "3 × 30-60s",
    steps: ["Appuis sur les avant-bras, coudes sous les épaules.", "Corps aligné de la tête aux talons.", "Serre abdos et fessiers.", "Respire calmement."],
    mistakes: ["Ne place pas le bassin trop haut ni trop bas.", "Ne relève pas la tête.", "Ne bloque pas ta respiration."],
    variants: { easier: "Planche sur les genoux.", harder: "Planche dynamique / lestée." },
  },
  {
    id: "crunch", name: "Crunch", emoji: "🧘", muscle: "Abdos", equipment: "Poids du corps", level: "Débutant",
    targets: ["Grand droit"], sets: "3 × 15-20",
    steps: ["Allongé, genoux fléchis, mains aux tempes.", "Enroule le haut du dos vers les genoux.", "Contracte les abdos en haut.", "Redescends sans relâcher totalement."],
    mistakes: ["Ne tire pas sur la nuque.", "Ne monte pas avec l'élan.", "Ne décolle pas tout le dos."],
    variants: { easier: "Amplitude réduite.", harder: "Lesté / avec relevé de jambes." },
  },
  {
    id: "burpees", name: "Burpees", emoji: "🔥", muscle: "Full body", equipment: "Poids du corps", level: "Intermédiaire",
    targets: ["Full body", "Cardio"], sets: "4 × 10-15",
    steps: ["Debout, descends en squat mains au sol.", "Lance les pieds en arrière en planche.", "(Option pompe) puis ramène les pieds.", "Saute en extension, bras au-dessus de la tête."],
    mistakes: ["Ne creuse pas le dos en planche.", "Ne réceptionne pas genoux raides.", "Ne pars pas dans un rythme désordonné."],
    variants: { easier: "Sans saut et sans pompe.", harder: "Avec pompe + saut groupé." },
  },
  {
    id: "mountain-climbers", name: "Mountain climbers", emoji: "🔥", muscle: "Full body", equipment: "Poids du corps", level: "Débutant",
    targets: ["Abdos", "Cardio"], sets: "4 × 30-45s",
    steps: ["Position de planche bras tendus.", "Ramène un genou vers la poitrine.", "Alterne rapidement les jambes.", "Garde le bassin stable."],
    mistakes: ["Ne laisse pas les fessiers monter.", "Ne laisse pas tes appuis devenir instables.", "Ne va pas trop vite sans contrôle."],
    variants: { easier: "Tempo lent et contrôlé.", harder: "Croisés / avec sliders." },
  },
  {
    id: "hip-thrust", name: "Hip thrust", emoji: "🦵", muscle: "Jambes", equipment: "Barre", level: "Intermédiaire",
    targets: ["Fessiers", "Ischios"], sets: "4 × 8-12",
    steps: ["Haut du dos sur un banc, barre sur les hanches (avec un coussin).", "Pieds à plat, talons sous les genoux.", "Pousse les hanches vers le haut.", "Contracte les fessiers en haut puis redescends."],
    mistakes: ["Ne pars pas en hyperextension lombaire.", "Ne pousse pas avec les pointes de pied.", "Ne fais pas une amplitude trop courte."],
    variants: { easier: "Pont fessier au sol sans charge.", harder: "Une jambe / pause en haut." },
  },
];

// Fonction pure : fait avancer le minuteur d'une seconde selon la config (Tabata/EMOM/perso).
function tickTimer(t, cfg) {
  if (!t.running) return t;
  if (t.remaining > 1) return { ...t, remaining: t.remaining - 1 };
  if (t.phase === "work" && cfg.rest > 0) return { ...t, phase: "rest", remaining: cfg.rest };
  if (t.round < cfg.rounds) return { ...t, phase: "work", remaining: cfg.work, round: t.round + 1 };
  return { ...t, phase: "done", remaining: 0, running: false };
}

function loadJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// Base d'exercices open-source (yuhonas/free-exercise-db) : ~870 exercices avec PHOTOS RÉELLES
// du mouvement (position de départ + position finale) et instructions. Chargée à la volée + cache.
const EX_DB_CDN = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main";
const EX_DB_URL = `${EX_DB_CDN}/dist/exercises.json`;
let exDbCache = null;

const exMuscleGroupFr = { abdominals: "Abdos", abductors: "Jambes", adductors: "Jambes", biceps: "Bras", calves: "Jambes", chest: "Pectoraux", forearms: "Bras", glutes: "Jambes", hamstrings: "Jambes", lats: "Dos", "lower back": "Dos", "middle back": "Dos", neck: "Cou", quadriceps: "Jambes", shoulders: "Épaules", traps: "Dos", triceps: "Bras" };
const exMuscleLabelFr = { abdominals: "Abdominaux", abductors: "Abducteurs", adductors: "Adducteurs", biceps: "Biceps", calves: "Mollets", chest: "Pectoraux", forearms: "Avant-bras", glutes: "Fessiers", hamstrings: "Ischios", lats: "Grand dorsal", "lower back": "Bas du dos", "middle back": "Milieu du dos", neck: "Cou", quadriceps: "Quadriceps", shoulders: "Épaules", traps: "Trapèzes", triceps: "Triceps" };
const exEquipFr = { "body only": "Poids du corps", barbell: "Barre", dumbbell: "Haltères", cable: "Poulie", machine: "Machine", kettlebells: "Kettlebell", bands: "Élastique", "e-z curl bar": "Barre EZ", "exercise ball": "Swiss ball", "medicine ball": "Medicine ball", "foam roll": "Rouleau", other: "Autre" };
const exLevelFr = { beginner: "Débutant", intermediate: "Intermédiaire", expert: "Avancé" };
const exGroupEmoji = { Pectoraux: "💪", Dos: "🏋️", Jambes: "🦵", "Épaules": "🏋️", Bras: "💪", Biceps: "💪", Triceps: "💪", "Avant-bras": "🤝", Abdos: "🧘", Abdominaux: "🧘", Lombaires: "🧎", Fessiers: "🍑", Quadriceps: "🦵", "Ischio-jambiers": "🦵", Adducteurs: "🦵", Abducteurs: "🦵", Mollets: "🦶", "Tibial antérieur": "🦶", Cou: "🧍", Autre: "🤸" };
const exMuscleGroupsFr = ["Pectoraux", "Dos", "Épaules", "Biceps", "Triceps", "Avant-bras", "Abdominaux", "Obliques", "Lombaires", "Fessiers", "Quadriceps", "Ischio-jambiers", "Adducteurs", "Abducteurs", "Mollets", "Tibial antérieur", "Cou"];
// Conseils « à éviter » génériques (affichés quand l'exercice n'a pas d'erreurs spécifiques).
const exGenericMistakes = [
  "Ne donne pas d'à-coups : contrôle chaque répétition.",
  "Ne sacrifie pas la posture : garde le dos gainé et stable.",
  "Ne bloque pas ta respiration (souffle à l'effort).",
  "Ne réduis pas l'amplitude : fais le mouvement complet.",
];
// « Comment faire » en français propre (générique, adapté au type/matériel/muscle).
function exGenericSteps(type, equipment, muscle) {
  const eq = equipment && equipment !== "Autre" ? ` avec ${String(equipment).toLowerCase()}` : "";
  const m = muscle ? String(muscle).toLowerCase() : "le muscle ciblé";
  if (type === "Mobilité") return [
    "Place-toi en position d'étirement en douceur, sans à-coups.",
    `Va progressivement jusqu'à une tension confortable sur ${m}.`,
    "Maintiens la position en respirant calmement, sans forcer.",
  ];
  if (type === "Cardio") return [
    "Mets-toi en position, gainage engagé.",
    "Réalise le mouvement de façon dynamique et régulière.",
    "Garde un rythme contrôlé pendant toute la durée prévue.",
  ];
  if (type === "Corps complet") return [
    `Installe-toi en position de départ${eq}, gainage engagé.`,
    "Enchaîne le mouvement complet en contrôlant la technique (regarde la démo / la vidéo).",
    "Reviens en position de départ et enchaîne les répétitions.",
  ];
  return [
    `Installe-toi en position de départ${eq}, dos gainé et stable.`,
    `Réalise le mouvement en contrôlant la charge sur toute l'amplitude (cible : ${m}).`,
    "Reviens lentement en position de départ en soufflant, puis enchaîne les répétitions.",
  ];
}

// « À éviter » SPÉCIFIQUE à chaque exercice (composé selon muscle + mouvement + matériel + type).
const exMuscleMistake = {
  Pectoraux: "N'écarte pas trop les coudes (protège les épaules).",
  Dos: "Ne tire pas seulement avec les bras : engage le dos.",
  "Épaules": "Ne cambre pas le bas du dos en poussant.",
  Biceps: "Ne balance pas le buste pour soulever.",
  Triceps: "Ne bouge pas les coudes pendant le mouvement.",
  "Avant-bras": "Ne bouge pas l'avant-bras : seul le poignet travaille.",
  Abdominaux: "Ne tire pas sur la nuque.",
  Obliques: "Ne compense pas avec les bras : tourne le buste.",
  Lombaires: "Ne pars pas en hyperextension brutale.",
  Fessiers: "Ne cambre pas le bas du dos en haut du mouvement.",
  Quadriceps: "Ne laisse pas les genoux rentrer vers l'intérieur.",
  "Ischio-jambiers": "N'arrondis pas le dos en descendant.",
  Adducteurs: "Ne force pas l'amplitude (aine).",
  Abducteurs: "Ne te penche pas pour tricher.",
  Mollets: "Ne raccourcis pas l'amplitude en haut.",
  "Tibial antérieur": "Ne force pas : garde un mouvement contrôlé.",
  Cou: "Ne force pas : reste progressif.",
};
const exEquipMistake = {
  Barre: "Ne laisse pas la barre dévier de sa trajectoire.",
  "Haltères": "Ne cogne pas les haltères et contrôle la descente.",
  Poulie: "Ne te balance pas pour tricher avec la poulie.",
  Machine: "Ne donne pas d'à-coups sur la machine.",
  "Élastique": "Ne relâche pas brutalement l'élastique.",
  Kettlebell: "Ne soulève pas avec le dos : utilise les hanches.",
  "Poids du corps": "Ne sacrifie pas la posture pour faire plus de répétitions.",
};
const exNameMistakes = [
  [/(squat|goblet|hack)/, "Ne laisse pas les talons décoller du sol."],
  [/(fente|lunge|montée)/, "Ne laisse pas le genou avant dépasser la pointe du pied."],
  [/(soulevé|deadlift)/, "Ne laisse pas la barre s'éloigner de tes jambes."],
  [/(développé|pompe|pec deck|écarté)/, "Ne verrouille pas les coudes brutalement."],
  [/curl/, "Ne bouge pas les coudes pendant la montée."],
  [/(rowing|tirage|traction)/, "Ne te redresse pas en tirant : garde la position."],
  [/(crunch|relevé de buste|sit)/, "Ne décolle pas tout le dos d'un coup."],
  [/(gainage|planche|plank)/, "Ne laisse pas le bassin s'affaisser."],
  [/(saut|jump|burpee|corde)/, "Ne réceptionne pas jambes raides : amortis."],
  [/(mollet|calf)/, "Ne plie pas les genoux pour tricher."],
  [/(étirement|stretch|mobilité)/, "Ne force pas jusqu'à la douleur."],
  [/(hip thrust|pont|kickback)/, "Ne pars pas en hyperextension lombaire."],
  [/dips/, "Ne descends pas trop bas (épaules)."],
  [/(extension triceps|barre au front|pushdown)/, "Ne bouge pas les coudes."],
  [/(élévation|oiseau|face pull)/, "N'utilise pas l'élan pour monter."],
];
function exMistakesFor(ex) {
  const name = (ex.name || "").toLowerCase();
  const out = [];
  if (exMuscleMistake[ex.muscle]) out.push(exMuscleMistake[ex.muscle]);
  for (const [rx, tip] of exNameMistakes) { if (rx.test(name)) { out.push(tip); break; } }
  if (exEquipMistake[ex.equipment]) out.push(exEquipMistake[ex.equipment]);
  if (ex.type === "Mobilité") out.push("Ne bloque pas ta respiration pendant l'étirement.");
  else if (ex.type === "Cardio") out.push("Ne sacrifie pas la posture pour aller plus vite.");
  else out.push("Ne bloque pas ta respiration (souffle à l'effort).");
  const uniq = [];
  for (const s of out) if (!uniq.includes(s)) uniq.push(s);
  for (const g of exGenericMistakes) { if (uniq.length >= 3) break; if (!uniq.includes(g)) uniq.push(g); }
  return uniq.slice(0, 4);
}
// Types d'exercices (ce ne sont PAS des muscles) : filtre séparé.
const exTypeOptions = ["Tous", "Musculation", "Cardio", "Mobilité", "Corps complet"];
const exEquipmentOptions = ["Tous", "Poids du corps", "Barre", "Haltères", "Machine", "Poulie", "Élastique", "Kettlebell", "Medicine ball", "Swiss ball", "Rouleau", "Autre"];
const exTypeOverride = {
  "Rope_Jumping": "Cardio",
  "Mountain_Climbers": "Cardio",
  "burpees": "Cardio",
  "Barbell_Deadlift": "Corps complet",
  "One-Arm_Kettlebell_Swings": "Corps complet",
  "Kettlebell_Thruster": "Corps complet",
  "Clean_and_Press": "Corps complet",
  "Power_Clean": "Corps complet",
  "Hip_Circles_prone": "Mobilité",
  "Arm_Circles": "Mobilité",
  "All_Fours_Quad_Stretch": "Mobilité",
  "90_90_Hamstring": "Mobilité",
};
// Reclasse certains exercices dans un groupe musculaire PRÉCIS (par id).
const exMuscleOverride = {
  "Cable_Russian_Twists": "Obliques",
  "Bosu_Ball_Cable_Crunch_With_Side_Bends": "Obliques",
  "Hyperextensions_Back_Extensions": "Lombaires",
  "Barbell_Full_Squat": "Quadriceps",
  "Calf_Press_On_The_Leg_Press_Machine": "Mollets",
  "Leg_Extensions": "Quadriceps",
  "Lying_Leg_Curls": "Ischio-jambiers",
  "Romanian_Deadlift": "Ischio-jambiers",
  "Dumbbell_Lunges": "Quadriceps",
  "Standing_Calf_Raises": "Mollets",
  "Barbell_Hip_Thrust": "Fessiers",
  "Goblet_Squat": "Quadriceps",
  "Rope_Jumping": "Mollets",
  "One-Arm_Kettlebell_Swings": "Fessiers",
  "Barbell_Curl": "Biceps",
  "Dumbbell_Alternate_Bicep_Curl": "Biceps",
  "Cable_Hammer_Curls_-_Rope_Attachment": "Biceps",
  "Concentration_Curls": "Biceps",
  "Reverse_Grip_Triceps_Pushdown": "Triceps",
  "Lying_Triceps_Press": "Triceps",
  "Close-Grip_Barbell_Bench_Press": "Triceps",
  "Standing_Dumbbell_Triceps_Extension": "Triceps",
  "Dips_-_Triceps_Version": "Triceps",
};

function mapDbExercise(raw) {
  const primary = raw.primaryMuscles || [];
  const group = exMuscleGroupFr[primary[0]] || "Autre";
  return {
    id: raw.id,
    name: raw.name,
    muscle: group,
    equipment: exEquipFr[raw.equipment] || raw.equipment || "Autre",
    level: exLevelFr[raw.level] || raw.level || "—",
    targets: [...(raw.primaryMuscles || []), ...(raw.secondaryMuscles || [])].map((m) => exMuscleLabelFr[m] || m),
    steps: raw.instructions || [],
    images: (raw.images || []).map((p) => `${EX_DB_CDN}/exercises/${p}`),
    category: raw.category || "",
    emoji: exGroupEmoji[group] || "🤸",
  };
}

// Photos réelles du mouvement (début/fin) depuis la base open-source, réutilisées dans notre
// bibliothèque 100% FRANÇAISE (noms + instructions rédigés en français).
const exUrl = (f) => [`${EX_DB_CDN}/exercises/${f}/0.jpg`, `${EX_DB_CDN}/exercises/${f}/1.jpg`];
const exerciseLibraryFr = [
  { id: "Barbell_Bench_Press_-_Medium_Grip", name: "Développé couché (barre)", muscle: "Pectoraux", equipment: "Barre", level: "Intermédiaire", targets: ["Pectoraux", "Triceps", "Épaules"], steps: ["Allonge-toi, omoplates serrées, pieds au sol.", "Descends la barre au milieu de la poitrine en contrôlant.", "Pousse jusqu'à l'extension complète."], mistakes: ["Ne fais pas rebondir la barre sur la poitrine.", "Ne décolle pas les fessiers du banc.", "N'écarte pas trop les coudes (90°)."], images: exUrl("Barbell_Bench_Press_-_Medium_Grip") },
  { id: "Incline_Dumbbell_Press", name: "Développé incliné haltères", muscle: "Pectoraux", equipment: "Haltères", level: "Débutant", targets: ["Haut des pectoraux", "Épaules"], steps: ["Banc incliné ~30°, un haltère dans chaque main.", "Descends les haltères au niveau des pectoraux.", "Pousse vers le haut sans verrouiller brutalement."], mistakes: ["Ne cambre pas excessivement le bas du dos.", "Ne cogne pas les haltères en haut.", "Ne descends pas trop bas (épaules)."], images: exUrl("Incline_Dumbbell_Press") },
  { id: "Plyo_Kettlebell_Pushups", name: "Pompes pliométriques", muscle: "Pectoraux", equipment: "Kettlebell", level: "Avancé", targets: ["Pectoraux", "Triceps", "Gainage"], steps: ["Mains sur deux kettlebells, corps gainé.", "Descends en contrôle.", "Pousse explosivement pour décoller les mains."], mistakes: ["Ne creuse pas le bas du dos.", "Ne réceptionne pas bras tendus raides.", "Ne néglige pas le gainage."], images: exUrl("Plyo_Kettlebell_Pushups") },
  { id: "Decline_Dumbbell_Flyes", name: "Écarté haltères décliné", muscle: "Pectoraux", equipment: "Haltères", level: "Débutant", targets: ["Pectoraux"], steps: ["Banc décliné, haltères au-dessus de la poitrine, coudes légèrement fléchis.", "Ouvre les bras en arc de cercle.", "Reviens en contractant les pectoraux."], mistakes: ["Ne tends pas complètement les coudes.", "Ne descends pas trop bas (épaules).", "N'utilise pas l'élan."], images: exUrl("Decline_Dumbbell_Flyes") },
  { id: "Cable_Crossover", name: "Écarté à la poulie", muscle: "Pectoraux", equipment: "Poulie", level: "Débutant", targets: ["Pectoraux"], steps: ["Poulies hautes, un pas en avant, léger buste penché.", "Amène les mains devant toi en arc de cercle.", "Contracte puis reviens en contrôle."], mistakes: ["N'arrondis pas le dos.", "Ne plie pas trop les coudes.", "Ne tire pas avec les épaules."], images: exUrl("Cable_Crossover") },
  { id: "Dips_-_Chest_Version", name: "Dips (pectoraux)", muscle: "Pectoraux", equipment: "Poids du corps", level: "Intermédiaire", targets: ["Pectoraux", "Triceps"], steps: ["Bras tendus, buste penché en avant.", "Descends en écartant légèrement les coudes.", "Pousse jusqu'à extension."], mistakes: ["Ne descends pas trop bas (épaules).", "Ne hausse pas les épaules.", "Ne fais pas d'à-coups."], images: exUrl("Dips_-_Chest_Version") },
  { id: "Pullups", name: "Tractions", muscle: "Dos", equipment: "Poids du corps", level: "Débutant", targets: ["Grand dorsal", "Biceps"], steps: ["Prise pronation un peu plus large que les épaules.", "Tire les coudes vers le bas, menton au-dessus de la barre.", "Descends en contrôle."], mistakes: ["Ne te balance pas.", "Ne raccourcis pas l'amplitude.", "Ne néglige pas l'engagement des épaules."], images: exUrl("Pullups") },
  { id: "Bent_Over_Barbell_Row", name: "Rowing barre buste penché", muscle: "Dos", equipment: "Barre", level: "Débutant", targets: ["Dos", "Biceps"], steps: ["Buste penché ~45°, dos plat.", "Tire la barre vers le bas-ventre.", "Contracte le dos puis redescends."], mistakes: ["N'arrondis pas le dos.", "Ne tire pas en à-coups.", "Ne te redresse pas à chaque répétition."], images: exUrl("Bent_Over_Barbell_Row") },
  { id: "One-Arm_Dumbbell_Row", name: "Rowing haltère un bras", muscle: "Dos", equipment: "Haltères", level: "Débutant", targets: ["Dos", "Biceps"], steps: ["Un genou et une main sur le banc, dos plat.", "Tire le coude vers la hanche.", "Redescends contrôlé."], mistakes: ["Ne tourne pas le buste.", "Ne tire pas avec le bras seul (engage le dos).", "N'arrondis pas le dos."], images: exUrl("One-Arm_Dumbbell_Row") },
  { id: "Wide-Grip_Lat_Pulldown", name: "Tirage vertical prise large", muscle: "Dos", equipment: "Poulie", level: "Débutant", targets: ["Grand dorsal", "Biceps"], steps: ["Prise large, buste légèrement incliné.", "Tire la barre vers le haut de la poitrine.", "Reviens en contrôlant."], mistakes: ["Ne tire pas derrière la nuque.", "Ne te balance pas avec le buste.", "Ne raccourcis pas l'amplitude."], images: exUrl("Wide-Grip_Lat_Pulldown") },
  { id: "Barbell_Deadlift", name: "Soulevé de terre (barre)", muscle: "Dos", equipment: "Barre", level: "Intermédiaire", targets: ["Ischios", "Fessiers", "Dos"], steps: ["Pieds largeur hanches, dos plat, barre près des tibias.", "Pousse dans le sol et tire la barre le long des jambes.", "Verrouille hanches et genoux en haut."], mistakes: ["N'arrondis pas le dos.", "Ne laisse pas la barre s'éloigner du corps.", "Ne pars pas en hyperextension en haut."], images: exUrl("Barbell_Deadlift") },
  { id: "Seated_Cable_Rows", name: "Rowing assis à la poulie", muscle: "Dos", equipment: "Poulie", level: "Débutant", targets: ["Dos", "Biceps"], steps: ["Assis, dos droit, légère flexion des genoux.", "Tire la poignée vers le nombril.", "Serre les omoplates puis reviens."], mistakes: ["N'arrondis pas le dos.", "Ne te balance pas en arrière.", "Ne tire pas avec les bras seuls (engage le dos)."], images: exUrl("Seated_Cable_Rows") },
  { id: "Hyperextensions_Back_Extensions", name: "Extensions lombaires", muscle: "Dos", equipment: "Poids du corps", level: "Débutant", targets: ["Bas du dos", "Fessiers"], steps: ["Hanches calées sur le banc à lombaires.", "Descends le buste en contrôle.", "Remonte jusqu'à l'alignement (sans hyperextension)."], mistakes: ["Ne pars pas en hyperextension lombaire.", "Ne fais pas d'à-coups.", "Ne descends pas trop vite."], images: exUrl("Hyperextensions_Back_Extensions") },
  { id: "Barbell_Full_Squat", name: "Squat complet (barre)", muscle: "Jambes", equipment: "Barre", level: "Intermédiaire", targets: ["Quadriceps", "Fessiers"], steps: ["Barre sur le haut du dos, pieds largeur épaules.", "Descends hanches en arrière jusqu'à cuisses parallèles.", "Remonte en poussant dans les talons."], mistakes: ["Ne laisse pas les genoux rentrer vers l'intérieur.", "N'arrondis pas le dos.", "Ne laisse pas les talons décoller."], images: exUrl("Barbell_Full_Squat") },
  { id: "Calf_Press_On_The_Leg_Press_Machine", name: "Mollets à la presse", muscle: "Jambes", equipment: "Machine", level: "Débutant", targets: ["Mollets"], steps: ["Pieds en bas de la plateforme, talons dans le vide.", "Pousse avec la pointe des pieds.", "Reviens en étirant le mollet."], mistakes: ["Ne plie pas les genoux.", "Ne raccourcis pas l'amplitude.", "Ne fais pas un mouvement rapide non contrôlé."], images: exUrl("Calf_Press_On_The_Leg_Press_Machine") },
  { id: "Leg_Extensions", name: "Leg extension", muscle: "Jambes", equipment: "Machine", level: "Débutant", targets: ["Quadriceps"], steps: ["Assis, chevilles sous le coussin.", "Tends les jambes en contractant les quadriceps.", "Redescends en contrôle."], mistakes: ["Ne donne pas d'à-coups.", "Ne décolle pas le bassin du siège.", "Ne verrouille pas brutalement les genoux."], images: exUrl("Leg_Extensions") },
  { id: "Lying_Leg_Curls", name: "Leg curl allongé", muscle: "Jambes", equipment: "Machine", level: "Débutant", targets: ["Ischios"], steps: ["Allongé, chevilles sous le coussin.", "Amène les talons vers les fessiers.", "Redescends lentement."], mistakes: ["Ne décolle pas le bassin.", "Ne fais pas d'à-coups.", "Ne raccourcis pas l'amplitude."], images: exUrl("Lying_Leg_Curls") },
  { id: "Romanian_Deadlift", name: "Soulevé de terre roumain", muscle: "Jambes", equipment: "Barre", level: "Intermédiaire", targets: ["Ischios", "Fessiers"], steps: ["Barre devant les cuisses, légère flexion des genoux.", "Descends la barre en poussant les hanches en arrière, dos plat.", "Remonte en contractant fessiers et ischios."], mistakes: ["N'arrondis pas le dos.", "Ne plie pas trop les genoux.", "Ne laisse pas la barre s'éloigner des jambes."], images: exUrl("Romanian_Deadlift") },
  { id: "Dumbbell_Lunges", name: "Fentes haltères", muscle: "Jambes", equipment: "Haltères", level: "Débutant", targets: ["Quadriceps", "Fessiers"], steps: ["Un haltère dans chaque main, buste droit.", "Avance d'un grand pas et descends le genou arrière.", "Pousse sur la jambe avant pour revenir."], mistakes: ["Ne laisse pas le genou avant dépasser la pointe du pied.", "Ne penche pas le buste en avant.", "Ne fais pas un pas trop court."], images: exUrl("Dumbbell_Lunges") },
  { id: "Standing_Calf_Raises", name: "Mollets debout", muscle: "Jambes", equipment: "Machine", level: "Débutant", targets: ["Mollets"], steps: ["Épaules sous les coussins, pointes de pieds sur la marche.", "Monte sur la pointe des pieds.", "Redescends en étirant."], mistakes: ["Ne plie pas les genoux.", "Ne raccourcis pas l'amplitude.", "Ne rebondis pas en bas."], images: exUrl("Standing_Calf_Raises") },
  { id: "Barbell_Hip_Thrust", name: "Hip thrust (barre)", muscle: "Jambes", equipment: "Barre", level: "Intermédiaire", targets: ["Fessiers", "Ischios"], steps: ["Haut du dos sur le banc, barre sur les hanches (coussin).", "Pousse les hanches vers le haut.", "Contracte les fessiers en haut puis redescends."], mistakes: ["Ne pars pas en hyperextension lombaire.", "Ne pousse pas avec les pointes de pied.", "Ne fais pas une amplitude trop courte."], images: exUrl("Barbell_Hip_Thrust") },
  { id: "Goblet_Squat", name: "Goblet squat", muscle: "Jambes", equipment: "Haltères", level: "Débutant", targets: ["Quadriceps", "Fessiers"], steps: ["Tiens un haltère contre la poitrine.", "Descends en squat, buste droit.", "Remonte en poussant dans les talons."], mistakes: ["Ne laisse pas les talons décoller.", "N'arrondis pas le dos.", "Ne penche pas le buste en avant."], images: exUrl("Goblet_Squat") },
  { id: "Standing_Military_Press", name: "Développé militaire debout", muscle: "Épaules", equipment: "Barre", level: "Débutant", targets: ["Épaules", "Triceps"], steps: ["Barre aux clavicules, gaine abdos et fessiers.", "Pousse la barre au-dessus de la tête.", "Redescends contrôlé aux clavicules."], mistakes: ["Ne cambre pas excessivement.", "Ne pousse pas la barre vers l'avant.", "Ne verrouille pas brutalement."], images: exUrl("Standing_Military_Press") },
  { id: "Seated_Side_Lateral_Raise", name: "Élévations latérales assis", muscle: "Épaules", equipment: "Haltères", level: "Débutant", targets: ["Deltoïdes latéraux"], steps: ["Assis, haltères le long du corps, coudes légèrement fléchis.", "Monte les bras jusqu'à l'horizontale.", "Redescends lentement."], mistakes: ["N'utilise pas l'élan.", "Ne monte pas au-dessus des épaules.", "Ne mets pas une charge trop lourde."], images: exUrl("Seated_Side_Lateral_Raise") },
  { id: "Front_Dumbbell_Raise", name: "Élévations frontales", muscle: "Épaules", equipment: "Haltères", level: "Débutant", targets: ["Deltoïdes antérieurs"], steps: ["Haltères devant les cuisses.", "Monte un bras jusqu'à l'horizontale.", "Redescends en contrôle, alterne."], mistakes: ["Ne te balance pas avec le buste.", "Ne monte pas au-dessus de l'horizontale.", "Ne mets pas une charge trop lourde."], images: exUrl("Front_Dumbbell_Raise") },
  { id: "Face_Pull", name: "Face pull (tirage visage)", muscle: "Épaules", equipment: "Poulie", level: "Intermédiaire", targets: ["Arrière d'épaule", "Trapèzes"], steps: ["Corde à hauteur du visage, recule pour tendre.", "Tire la corde vers le front en écartant les mains.", "Reviens en contrôle."], mistakes: ["Ne hausse pas les épaules.", "N'utilise pas l'élan.", "Ne tire pas trop bas (vise le visage)."], images: exUrl("Face_Pull") },
  { id: "Arnold_Dumbbell_Press", name: "Développé Arnold", muscle: "Épaules", equipment: "Haltères", level: "Intermédiaire", targets: ["Épaules", "Triceps"], steps: ["Assis, haltères devant, paumes vers toi.", "Pousse en tournant les paumes vers l'avant.", "Redescends en inversant la rotation."], mistakes: ["Ne cambre pas le bas du dos.", "Ne verrouille pas brutalement.", "Ne descends pas trop bas (épaules)."], images: exUrl("Arnold_Dumbbell_Press") },
  { id: "Upright_Barbell_Row", name: "Rowing menton (barre)", muscle: "Épaules", equipment: "Barre", level: "Débutant", targets: ["Épaules", "Trapèzes"], steps: ["Barre prise serrée devant les cuisses.", "Tire la barre vers le menton, coudes hauts.", "Redescends en contrôle."], mistakes: ["Ne monte pas les coudes trop haut (épaules).", "Ne te balance pas.", "Ne mets pas une charge trop lourde."], images: exUrl("Upright_Barbell_Row") },
  { id: "Barbell_Curl", name: "Curl barre", muscle: "Bras", equipment: "Barre", level: "Débutant", targets: ["Biceps"], steps: ["Barre en supination, coudes près du corps.", "Fléchis les avant-bras.", "Redescends en contrôle."], mistakes: ["Ne balance pas le buste.", "Ne bouge pas les coudes.", "Ne raccourcis pas l'amplitude."], images: exUrl("Barbell_Curl") },
  { id: "Dumbbell_Alternate_Bicep_Curl", name: "Curl haltères alterné", muscle: "Bras", equipment: "Haltères", level: "Débutant", targets: ["Biceps"], steps: ["Un haltère dans chaque main, paumes vers l'avant.", "Fléchis un bras puis l'autre.", "Contrôle la descente."], mistakes: ["Ne balance pas les épaules.", "Ne bouge pas les coudes.", "Ne lâche pas la descente."], images: exUrl("Dumbbell_Alternate_Bicep_Curl") },
  { id: "Cable_Hammer_Curls_-_Rope_Attachment", name: "Curl marteau à la corde", muscle: "Bras", equipment: "Poulie", level: "Débutant", targets: ["Biceps", "Avant-bras"], steps: ["Corde sur poulie basse, prise neutre.", "Fléchis les avant-bras vers le haut.", "Redescends lentement."], mistakes: ["Ne bouge pas les coudes.", "Ne te balance pas.", "Ne raccourcis pas l'amplitude."], images: exUrl("Cable_Hammer_Curls_-_Rope_Attachment") },
  { id: "Concentration_Curls", name: "Curl concentration", muscle: "Bras", equipment: "Haltères", level: "Débutant", targets: ["Biceps"], steps: ["Assis, coude calé sur l'intérieur de la cuisse.", "Fléchis l'avant-bras en contractant le biceps.", "Redescends en contrôle."], mistakes: ["Ne balance pas le bras.", "N'utilise pas l'élan.", "Ne lâche pas la descente."], images: exUrl("Concentration_Curls") },
  { id: "Reverse_Grip_Triceps_Pushdown", name: "Extension triceps poulie", muscle: "Bras", equipment: "Poulie", level: "Débutant", targets: ["Triceps"], steps: ["Prise supination à la poulie haute, coudes au corps.", "Tends les bras vers le bas.", "Reviens en contrôle."], mistakes: ["Ne bouge pas les coudes.", "Ne te penche pas en avant pour tricher.", "Ne raccourcis pas l'amplitude."], images: exUrl("Reverse_Grip_Triceps_Pushdown") },
  { id: "Lying_Triceps_Press", name: "Barre au front (skull crusher)", muscle: "Bras", equipment: "Barre", level: "Intermédiaire", targets: ["Triceps"], steps: ["Allongé, barre au-dessus du front, coudes fixes.", "Descends la barre vers le front.", "Tends les bras sans bouger les coudes."], mistakes: ["Ne bouge pas les coudes.", "Ne descends pas la barre trop vite.", "N'écarte pas les coudes."], images: exUrl("Lying_Triceps_Press") },
  { id: "Close-Grip_Barbell_Bench_Press", name: "Développé couché prise serrée", muscle: "Bras", equipment: "Barre", level: "Débutant", targets: ["Triceps", "Pectoraux"], steps: ["Mains largeur des épaules, coudes près du corps.", "Descends la barre vers le bas de la poitrine.", "Pousse en contractant les triceps."], mistakes: ["N'écarte pas les coudes.", "Ne fais pas rebondir la barre.", "Ne décolle pas les fessiers du banc."], images: exUrl("Close-Grip_Barbell_Bench_Press") },
  { id: "Standing_Dumbbell_Triceps_Extension", name: "Extension triceps haltère", muscle: "Bras", equipment: "Haltères", level: "Débutant", targets: ["Triceps"], steps: ["Haltère à deux mains au-dessus de la tête.", "Descends derrière la nuque, coudes fixes.", "Tends les bras vers le haut."], mistakes: ["Ne bouge pas les coudes.", "Ne cambre pas le bas du dos.", "Ne descends pas trop vite."], images: exUrl("Standing_Dumbbell_Triceps_Extension") },
  { id: "Dips_-_Triceps_Version", name: "Dips (triceps)", muscle: "Bras", equipment: "Poids du corps", level: "Débutant", targets: ["Triceps"], steps: ["Bras tendus, buste droit.", "Descends en pliant les coudes vers l'arrière.", "Pousse jusqu'à extension."], mistakes: ["Ne descends pas trop bas (épaules).", "Ne penche pas trop le buste en avant.", "Ne fais pas d'à-coups."], images: exUrl("Dips_-_Triceps_Version") },
  { id: "Crunches", name: "Crunch", muscle: "Abdos", equipment: "Poids du corps", level: "Débutant", targets: ["Grand droit"], steps: ["Allongé, genoux fléchis, mains aux tempes.", "Enroule le buste vers les genoux.", "Redescends sans relâcher totalement."], mistakes: ["Ne tire pas sur la nuque.", "Ne monte pas avec l'élan.", "Ne décolle pas tout le dos."], images: exUrl("Crunches") },
  { id: "Plank", name: "Gainage planche", muscle: "Abdos", equipment: "Poids du corps", level: "Débutant", targets: ["Abdos", "Gainage"], steps: ["Appuis sur les avant-bras, corps aligné.", "Serre abdos et fessiers.", "Maintiens en respirant calmement."], mistakes: ["Ne laisse pas le bassin s'affaisser.", "Ne relève pas la tête.", "Ne bloque pas ta respiration."], images: exUrl("Plank") },
  { id: "Hanging_Leg_Raise", name: "Relevé de jambes suspendu", muscle: "Abdos", equipment: "Poids du corps", level: "Avancé", targets: ["Abdos"], steps: ["Suspendu à la barre, gainé.", "Monte les jambes (tendues ou genoux fléchis).", "Redescends sans balancer."], mistakes: ["Ne te balance pas.", "Ne tire pas avec les bras.", "Ne creuse pas le bas du dos."], images: exUrl("Hanging_Leg_Raise") },
  { id: "Cable_Russian_Twists", name: "Russian twist à la poulie", muscle: "Abdos", equipment: "Poulie", level: "Débutant", targets: ["Obliques"], steps: ["Debout de profil à la poulie, bras tendus.", "Pivote le buste loin de la poulie.", "Reviens en contrôle, change de côté."], mistakes: ["Ne bouge pas les bras seuls (tourne le buste).", "Ne va pas trop vite sans contrôle.", "N'arrondis pas le dos."], images: exUrl("Cable_Russian_Twists") },
  { id: "Bosu_Ball_Cable_Crunch_With_Side_Bends", name: "Crunch poulie (Bosu)", muscle: "Abdos", equipment: "Poulie", level: "Débutant", targets: ["Abdos", "Obliques"], steps: ["À genoux face à la poulie haute, corde derrière la nuque.", "Enroule le buste vers le sol.", "Ajoute une légère flexion latérale puis reviens."], mistakes: ["Ne tire pas sur la nuque.", "Ne fais pas d'à-coups.", "Ne perds pas l'équilibre."], images: exUrl("Bosu_Ball_Cable_Crunch_With_Side_Bends") },
  { id: "Mountain_Climbers", name: "Mountain climbers", muscle: "Abdos", equipment: "Poids du corps", level: "Débutant", targets: ["Abdos", "Cardio"], steps: ["Position de planche bras tendus.", "Ramène alternativement les genoux vers la poitrine.", "Garde le bassin stable, rythme régulier."], mistakes: ["Ne laisse pas les fessiers monter.", "Ne creuse pas le bas du dos.", "Ne va pas trop vite sans contrôle."], images: exUrl("Mountain_Climbers") },
  { id: "Rope_Jumping", name: "Corde à sauter", muscle: "Jambes", equipment: "Poids du corps", level: "Intermédiaire", targets: ["Mollets", "Cardio"], steps: ["Coudes près du corps, saut léger sur la pointe des pieds.", "Fais tourner la corde avec les poignets.", "Garde un rythme régulier."], mistakes: ["Ne saute pas trop haut.", "Ne fais pas tourner la corde avec les bras (poignets).", "Ne réceptionne pas talons raides."], images: exUrl("Rope_Jumping") },
  { id: "One-Arm_Kettlebell_Swings", name: "Kettlebell swing un bras", muscle: "Jambes", equipment: "Kettlebell", level: "Intermédiaire", targets: ["Fessiers", "Ischios", "Dos"], steps: ["Kettlebell entre les jambes, dos plat.", "Propulse les hanches vers l'avant pour balancer la kettlebell.", "Contrôle la redescente entre les jambes."], mistakes: ["N'arrondis pas le dos.", "Ne soulève pas avec les bras (pousse les hanches).", "Ne fais pas un simple demi-squat."], images: exUrl("One-Arm_Kettlebell_Swings") },
  { id: "Cable_Wrist_Curl", name: "Curl poignets à la poulie", muscle: "Avant-bras", equipment: "Poulie", level: "Débutant", targets: ["Avant-bras"], steps: ["Assis, avant-bras posés sur les cuisses, poignets dans le vide.", "Enroule les poignets vers le haut.", "Redescends lentement en contrôle."], mistakes: ["Ne bouge pas les avant-bras.", "Ne raccourcis pas l'amplitude.", "Ne lâche pas la descente."], images: exUrl("Cable_Wrist_Curl") },
  { id: "Dumbbell_Lying_Supination", name: "Supination haltère allongé", muscle: "Avant-bras", equipment: "Haltères", level: "Intermédiaire", targets: ["Avant-bras"], steps: ["Allongé sur le côté, avant-bras posé, haltère chargé d'un seul côté.", "Tourne le poignet en supination.", "Reviens lentement."], mistakes: ["Ne bouge pas l'avant-bras.", "Ne va pas trop vite.", "Ne mets pas une charge trop lourde."], images: exUrl("Dumbbell_Lying_Supination") },
  { id: "Adductor", name: "Machine adducteurs", muscle: "Adducteurs", equipment: "Machine", level: "Intermédiaire", targets: ["Adducteurs"], steps: ["Assis sur la machine, cuisses écartées contre les coussins.", "Resserre les cuisses en contractant l'intérieur.", "Reviens en contrôle."], mistakes: ["Ne donne pas d'à-coups.", "Ne te penche pas en arrière pour tricher.", "Ne force pas l'amplitude (aine)."], images: exUrl("Adductor") },
  { id: "Band_Hip_Adductions", name: "Adduction de hanche à l'élastique", muscle: "Adducteurs", equipment: "Élastique", level: "Débutant", targets: ["Adducteurs"], steps: ["Élastique à la cheville, fixé sur le côté.", "Ramène la jambe vers l'intérieur, devant l'autre.", "Reviens lentement."], mistakes: ["Ne donne pas d'à-coups.", "Ne tourne pas le buste.", "Ne lâche pas le retour."], images: exUrl("Band_Hip_Adductions") },
  { id: "Hip_Circles_prone", name: "Cercles de hanche (abducteurs)", muscle: "Abducteurs", equipment: "Poids du corps", level: "Débutant", targets: ["Abducteurs"], steps: ["À quatre pattes, gaine le tronc.", "Ouvre la hanche sur le côté en cercle.", "Contrôle le mouvement, change de côté."], mistakes: ["Ne cambre pas le bas du dos.", "Ne fais pas d'à-coups.", "Ne perds pas le gainage."], images: exUrl("Hip_Circles_prone") },
  { id: "Isometric_Neck_Exercise_-_Front_And_Back", name: "Cou isométrique (avant/arrière)", muscle: "Cou", equipment: "Poids du corps", level: "Débutant", targets: ["Cou"], steps: ["Main sur le front, pousse la tête contre la main sans bouger.", "Maintiens quelques secondes.", "Répète à l'arrière de la tête."], mistakes: ["Ne pousse pas trop fort (reste progressif).", "Ne bloque pas ta respiration.", "Ne bouge pas la tête (isométrie)."], images: exUrl("Isometric_Neck_Exercise_-_Front_And_Back") },
  { id: "Isometric_Neck_Exercise_-_Sides", name: "Cou isométrique (côtés)", muscle: "Cou", equipment: "Poids du corps", level: "Débutant", targets: ["Cou"], steps: ["Main sur le côté de la tête.", "Pousse la tête contre la main sans bouger.", "Maintiens puis change de côté."], mistakes: ["Ne pousse pas trop fort (reste progressif).", "Ne bloque pas ta respiration.", "Ne bouge pas la tête (isométrie)."], images: exUrl("Isometric_Neck_Exercise_-_Sides") },
  { id: "Anterior_Tibialis-SMR", name: "Tibial antérieur au rouleau (automassage)", muscle: "Tibial antérieur", equipment: "Poids du corps", level: "Intermédiaire", type: "Mobilité", targets: ["Tibial antérieur"], steps: ["Place un rouleau sous l'avant du tibia, en appui à quatre pattes.", "Fais rouler lentement de la cheville vers le genou.", "Insiste 20-30 s sur les zones sensibles, puis change de jambe."], mistakes: ["Ne roule pas sur l'os (reste sur le muscle).", "Ne bloque pas ta respiration.", "Ne va pas trop vite."], images: exUrl("Anterior_Tibialis-SMR") },
  // Corps complet
  { id: "Kettlebell_Thruster", name: "Thruster kettlebell", muscle: "Épaules", equipment: "Kettlebell", level: "Intermédiaire", targets: ["Jambes", "Épaules", "Full body"], steps: ["Kettlebell(s) au niveau des épaules, pieds largeur des hanches.", "Descends en squat.", "Remonte en poussant la kettlebell au-dessus de la tête."], mistakes: ["N'arrondis pas le dos.", "Ne pousse pas la charge vers l'avant.", "Ne verrouille pas brutalement."], images: exUrl("Kettlebell_Thruster") },
  { id: "Clean_and_Press", name: "Épaulé-jeté (clean & press)", muscle: "Épaules", equipment: "Barre", level: "Avancé", targets: ["Full body", "Épaules"], steps: ["Barre au sol, dos plat.", "Tire-la explosivement jusqu'aux épaules (épaulé).", "Pousse au-dessus de la tête puis redescends contrôlé."], mistakes: ["N'arrondis pas le dos.", "Ne tire pas avec les bras (explose des hanches).", "Ne pars pas en hyperextension en haut."], images: exUrl("Clean_and_Press") },
  { id: "Power_Clean", name: "Épaulé (power clean)", muscle: "Ischio-jambiers", equipment: "Barre", level: "Avancé", targets: ["Full body", "Ischios", "Trapèzes"], steps: ["Barre au sol, dos plat, hanches basses.", "Tire explosivement la barre le long du corps.", "Réceptionne aux épaules en fléchissant les jambes."], mistakes: ["N'arrondis pas le dos.", "Ne laisse pas la barre s'éloigner du corps.", "Ne tire pas trop tôt avec les bras."], images: exUrl("Power_Clean") },
  { id: "Star_Jump", name: "Sauts étoile (star jumps)", muscle: "Quadriceps", equipment: "Poids du corps", level: "Débutant", type: "Cardio", targets: ["Full body", "Cardio"], steps: ["Debout, descends légèrement en demi-squat.", "Saute en écartant bras et jambes en étoile.", "Réceptionne souplement et enchaîne le saut suivant."], mistakes: ["Ne réceptionne pas genoux raides.", "Ne creuse pas le bas du dos.", "Ne perds pas le rythme."], images: exUrl("Star_Jump") },
  { id: "Rocket_Jump", name: "Squat sauté (rocket jump)", muscle: "Quadriceps", equipment: "Poids du corps", level: "Intermédiaire", type: "Cardio", targets: ["Quadriceps", "Fessiers", "Cardio"], steps: ["Descends en squat, mains au corps.", "Pousse explosivement pour sauter le plus haut possible.", "Réceptionne en fléchissant les genoux et enchaîne."], mistakes: ["Ne réceptionne pas genoux raides.", "N'arrondis pas le dos.", "Ne néglige pas l'amorti à la réception."], images: exUrl("Rocket_Jump") },
  // Mobilité / Étirement
  { id: "Arm_Circles", name: "Cercles de bras (échauffement)", muscle: "Épaules", equipment: "Poids du corps", level: "Débutant", targets: ["Épaules"], steps: ["Bras tendus sur les côtés.", "Fais de petits cercles vers l'avant.", "Puis vers l'arrière, en augmentant l'amplitude."], mistakes: ["Ne hausse pas les épaules.", "Ne fais pas de trop grands cercles d'un coup.", "Ne bloque pas ta respiration."], images: exUrl("Arm_Circles") },
  { id: "All_Fours_Quad_Stretch", name: "Étirement quadriceps", muscle: "Quadriceps", equipment: "Poids du corps", level: "Débutant", targets: ["Quadriceps"], steps: ["À genoux, attrape une cheville derrière toi.", "Ramène le talon vers le fessier.", "Maintiens l'étirement sans cambrer."], mistakes: ["Ne cambre pas le bas du dos.", "Ne force pas l'étirement (douleur).", "Ne bloque pas ta respiration."], images: exUrl("All_Fours_Quad_Stretch") },
  { id: "90_90_Hamstring", name: "Étirement ischios 90/90", muscle: "Ischio-jambiers", equipment: "Poids du corps", level: "Débutant", targets: ["Ischios"], steps: ["Allongé, hanche et genou à 90°.", "Tends doucement la jambe vers le plafond.", "Maintiens l'étirement à l'arrière de la cuisse."], mistakes: ["Ne force pas l'étirement (douleur).", "Ne décolle pas le bas du dos.", "Ne bloque pas ta respiration."], images: exUrl("90_90_Hamstring") },
  { id: "Decline_Barbell_Bench_Press", name: "Développé décliné (barre)", muscle: "Pectoraux", equipment: "Barre", level: "Débutant", targets: ["Bas des pectoraux", "Triceps"], steps: ["Allongé sur banc décliné, prise un peu plus large que les épaules.", "Descends la barre vers le bas de la poitrine.", "Pousse jusqu'à l'extension."], mistakes: ["Ne décolle pas le bassin du banc.", "Ne fais pas rebondir la barre sur la poitrine."], images: exUrl("Decline_Barbell_Bench_Press") },
  { id: "Butterfly", name: "Pec deck (butterfly)", muscle: "Pectoraux", equipment: "Machine", level: "Débutant", targets: ["Pectoraux"], steps: ["Assis, dos plaqué, avant-bras sur les coussins.", "Rapproche les coudes devant toi en contractant les pectoraux.", "Reviens lentement sans relâcher complètement."], mistakes: ["Ne hausse pas les épaules.", "Ne va pas trop loin en arrière (tu forces l'épaule)."], images: exUrl("Butterfly") },
  { id: "Lying_T-Bar_Row", name: "Rowing T-bar allongé", muscle: "Dos", equipment: "Barre", level: "Intermédiaire", targets: ["Dos", "Biceps"], steps: ["Allongé face contre le banc incliné, saisis les poignées.", "Tire la charge vers toi en serrant les omoplates.", "Redescends en contrôle."], mistakes: ["Ne décolle pas la poitrine du banc.", "Ne tire pas en à-coups."], images: exUrl("Lying_T-Bar_Row") },
  { id: "Close-Grip_Front_Lat_Pulldown", name: "Tirage vertical prise serrée", muscle: "Dos", equipment: "Poulie", level: "Débutant", targets: ["Grand dorsal", "Biceps"], steps: ["Prise serrée à la poulie haute, buste légèrement incliné.", "Tire la barre vers le haut de la poitrine.", "Reviens en contrôlant."], mistakes: ["Ne te balance pas avec le buste.", "Ne tire pas derrière la nuque."], images: exUrl("Close-Grip_Front_Lat_Pulldown") },
  { id: "Chin-Up", name: "Tractions supination", muscle: "Dos", equipment: "Poids du corps", level: "Débutant", targets: ["Grand dorsal", "Biceps"], steps: ["Prise supination (paumes vers toi), largeur épaules.", "Tire jusqu'à ce que le menton dépasse la barre.", "Descends en contrôle."], mistakes: ["Ne raccourcis pas l'amplitude.", "Ne te balance pas."], images: exUrl("Chin-Up") },
  { id: "Rope_Straight-Arm_Pulldown", name: "Tirage bras tendus à la corde", muscle: "Dos", equipment: "Poulie", level: "Débutant", targets: ["Grand dorsal"], steps: ["Debout face à la poulie haute, bras quasi tendus.", "Abaisse la corde vers les cuisses sans plier les coudes.", "Reviens en contrôle."], mistakes: ["Ne plie pas les coudes.", "N'arrondis pas le dos."], images: exUrl("Rope_Straight-Arm_Pulldown") },
  { id: "Reverse_Machine_Flyes", name: "Oiseau machine (arrière d'épaule)", muscle: "Épaules", equipment: "Machine", level: "Débutant", targets: ["Arrière d'épaule", "Trapèzes"], steps: ["Assis face au dossier, saisis les poignées.", "Écarte les bras vers l'arrière en serrant les omoplates.", "Reviens lentement."], mistakes: ["N'utilise pas l'élan.", "Ne hausse pas les épaules."], images: exUrl("Reverse_Machine_Flyes") },
  { id: "Seated_Dumbbell_Press", name: "Développé épaules haltères assis", muscle: "Épaules", equipment: "Haltères", level: "Débutant", targets: ["Épaules", "Triceps"], steps: ["Assis, dos calé, haltères au niveau des oreilles.", "Pousse au-dessus de la tête sans verrouiller brutalement.", "Redescends contrôlé."], mistakes: ["Ne cambre pas le bas du dos.", "Ne descends pas trop bas."], images: exUrl("Seated_Dumbbell_Press") },
  { id: "Cable_Preacher_Curl", name: "Curl pupitre à la poulie", muscle: "Biceps", equipment: "Poulie", level: "Débutant", targets: ["Biceps"], steps: ["Bras posés sur le pupitre, poulie basse.", "Fléchis les avant-bras en contractant les biceps.", "Redescends lentement."], mistakes: ["Ne décolle pas les coudes.", "Ne lâche pas la descente."], images: exUrl("Cable_Preacher_Curl") },
  { id: "Alternate_Incline_Dumbbell_Curl", name: "Curl incliné alterné", muscle: "Biceps", equipment: "Haltères", level: "Débutant", targets: ["Biceps"], steps: ["Assis sur banc incliné, bras le long du corps.", "Fléchis un bras puis l'autre.", "Contrôle la descente, bras bien étirés."], mistakes: ["Ne balance pas les épaules.", "Ne raccourcis pas l'amplitude."], images: exUrl("Alternate_Incline_Dumbbell_Curl") },
  { id: "Bench_Dips", name: "Dips sur banc", muscle: "Triceps", equipment: "Poids du corps", level: "Débutant", targets: ["Triceps"], steps: ["Mains sur le banc derrière toi, jambes devant.", "Descends en pliant les coudes vers l'arrière.", "Pousse jusqu'à extension."], mistakes: ["Ne descends pas trop bas (épaules).", "N'écarte pas les coudes."], images: exUrl("Bench_Dips") },
  { id: "Cable_One_Arm_Tricep_Extension", name: "Extension triceps poulie un bras", muscle: "Triceps", equipment: "Poulie", level: "Débutant", targets: ["Triceps"], steps: ["Poulie haute, coude collé au corps.", "Tends le bras vers le bas.", "Reviens lentement."], mistakes: ["Ne bouge pas le coude.", "N'utilise pas l'épaule."], images: exUrl("Cable_One_Arm_Tricep_Extension") },
  { id: "Decline_Crunch", name: "Crunch décliné", muscle: "Abdominaux", equipment: "Poids du corps", level: "Intermédiaire", targets: ["Grand droit"], steps: ["Allongé sur banc décliné, mains aux tempes.", "Enroule le buste vers les genoux.", "Redescends sans relâcher totalement."], mistakes: ["Ne tire pas sur la nuque.", "Ne bloque pas ta respiration."], images: exUrl("Decline_Crunch") },
  { id: "Ab_Roller", name: "Roue abdominale (ab wheel)", muscle: "Abdominaux", equipment: "Poids du corps", level: "Intermédiaire", targets: ["Abdos", "Gainage"], steps: ["À genoux, mains sur la roue.", "Déroule vers l'avant en gardant le dos gainé.", "Reviens en contractant les abdos."], mistakes: ["Ne creuse pas le bas du dos.", "Ne va pas trop loin sans contrôle."], images: exUrl("Ab_Roller") },
  { id: "Side_Bridge", name: "Gainage latéral (planche côté)", muscle: "Obliques", equipment: "Poids du corps", level: "Débutant", targets: ["Obliques", "Gainage"], steps: ["Sur le côté, en appui sur l'avant-bras.", "Décolle le bassin, corps aligné.", "Maintiens puis change de côté."], mistakes: ["Ne laisse pas le bassin s'affaisser.", "Ne laisse pas la tête se désaligner."], images: exUrl("Side_Bridge") },
  { id: "Dumbbell_Side_Bend", name: "Flexion latérale haltère", muscle: "Obliques", equipment: "Haltères", level: "Débutant", targets: ["Obliques"], steps: ["Debout, un haltère dans une main.", "Penche le buste sur le côté chargé.", "Reviens en contractant les obliques opposés."], mistakes: ["Ne penche pas en avant ni en arrière.", "Ne mets pas une charge trop lourde."], images: exUrl("Dumbbell_Side_Bend") },
  { id: "Superman", name: "Superman (extension lombaire)", muscle: "Lombaires", equipment: "Poids du corps", level: "Débutant", targets: ["Bas du dos", "Fessiers"], steps: ["Allongé sur le ventre, bras tendus devant.", "Décolle bras et jambes simultanément.", "Maintiens 1-2 s puis redescends."], mistakes: ["Ne fais pas d'hyperextension brutale de la nuque.", "Ne fais pas de mouvement en à-coups."], images: exUrl("Superman") },
  { id: "Band_Good_Morning", name: "Good morning à l'élastique", muscle: "Lombaires", equipment: "Élastique", level: "Débutant", targets: ["Bas du dos", "Ischios"], steps: ["Élastique sur la nuque/épaules, pieds largeur hanches.", "Penche le buste en poussant les hanches en arrière, dos plat.", "Reviens en contractant fessiers et lombaires."], mistakes: ["N'arrondis pas le dos.", "Ne plie pas les genoux comme un squat."], images: exUrl("Band_Good_Morning") },
  { id: "Butt_Lift_Bridge", name: "Pont fessier au sol", muscle: "Fessiers", equipment: "Poids du corps", level: "Débutant", targets: ["Fessiers", "Ischios"], steps: ["Allongé, genoux fléchis, pieds à plat.", "Pousse les hanches vers le haut en serrant les fessiers.", "Redescends sans poser complètement."], mistakes: ["Ne cambre pas le bas du dos.", "Ne pousse pas avec les pointes de pied."], images: exUrl("Butt_Lift_Bridge") },
  { id: "Glute_Kickback", name: "Kickback fessier", muscle: "Fessiers", equipment: "Poids du corps", level: "Débutant", targets: ["Fessiers"], steps: ["À quatre pattes, dos gainé.", "Pousse un talon vers l'arrière/haut, jambe fléchie.", "Contracte le fessier puis reviens en contrôle."], mistakes: ["Ne cambre pas le bas du dos.", "Ne monte pas trop haut avec élan."], images: exUrl("Glute_Kickback") },
  { id: "Front_Barbell_Squat", name: "Squat avant (front squat)", muscle: "Quadriceps", equipment: "Barre", level: "Avancé", targets: ["Quadriceps", "Fessiers"], steps: ["Barre posée sur l'avant des épaules, coudes hauts.", "Descends en gardant le buste vertical.", "Remonte en poussant dans les talons."], mistakes: ["Ne laisse pas les coudes tomber.", "Ne laisse pas les talons décoller."], images: exUrl("Front_Barbell_Squat") },
  { id: "Barbell_Hack_Squat", name: "Hack squat (barre derrière)", muscle: "Quadriceps", equipment: "Barre", level: "Intermédiaire", targets: ["Quadriceps"], steps: ["Barre derrière les jambes, prise mains arrière.", "Descends en squat, buste droit.", "Remonte en poussant dans les talons."], mistakes: ["N'arrondis pas le dos.", "Ne laisse pas les talons décoller."], images: exUrl("Barbell_Hack_Squat") },
  { id: "Seated_Leg_Curl", name: "Leg curl assis", muscle: "Ischio-jambiers", equipment: "Machine", level: "Débutant", targets: ["Ischios"], steps: ["Assis, chevilles sur le coussin, cuisses bloquées.", "Fléchis les genoux en ramenant les talons sous le siège.", "Redescends lentement."], mistakes: ["Ne décolle pas le bassin.", "Ne fais pas d'à-coups."], images: exUrl("Seated_Leg_Curl") },
  { id: "Stiff-Legged_Barbell_Deadlift", name: "Soulevé jambes tendues", muscle: "Ischio-jambiers", equipment: "Barre", level: "Intermédiaire", targets: ["Ischios", "Fessiers"], steps: ["Barre devant les cuisses, jambes quasi tendues.", "Descends la barre en poussant les hanches en arrière, dos plat.", "Remonte en contractant les ischios."], mistakes: ["N'arrondis pas le dos.", "Ne descends pas plus bas que ta souplesse ne le permet."], images: exUrl("Stiff-Legged_Barbell_Deadlift") },
  { id: "Barbell_Seated_Calf_Raise", name: "Mollets assis (barre)", muscle: "Mollets", equipment: "Barre", level: "Débutant", targets: ["Mollets (soléaire)"], steps: ["Assis, barre sur les genoux, pointes sur une cale.", "Monte sur la pointe des pieds.", "Redescends en étirant le mollet."], mistakes: ["Ne fais pas une amplitude trop courte.", "Ne fais pas un mouvement rapide non contrôlé."], images: exUrl("Barbell_Seated_Calf_Raise") },
  { id: "Donkey_Calf_Raises", name: "Mollets âne (donkey)", muscle: "Mollets", equipment: "Poids du corps", level: "Intermédiaire", targets: ["Mollets"], steps: ["Buste penché en avant, pointes sur une marche.", "Monte sur la pointe des pieds.", "Redescends en étirant."], mistakes: ["Ne plie pas les genoux.", "Ne raccourcis pas l'amplitude."], images: exUrl("Donkey_Calf_Raises") },
  { id: "Thigh_Abductor", name: "Machine abducteurs", muscle: "Abducteurs", equipment: "Machine", level: "Débutant", targets: ["Abducteurs"], steps: ["Assis, genoux contre les coussins extérieurs.", "Écarte les cuisses contre la résistance.", "Reviens en contrôle."], mistakes: ["Ne te penche pas en arrière pour tricher.", "Ne fais pas de mouvement saccadé."], images: exUrl("Thigh_Abductor") },
  { id: "Thigh_Adductor", name: "Machine adducteurs (assis)", muscle: "Adducteurs", equipment: "Machine", level: "Débutant", targets: ["Adducteurs"], steps: ["Assis, cuisses écartées contre les coussins intérieurs.", "Resserre les cuisses contre la résistance.", "Reviens en contrôle."], mistakes: ["Ne fais pas d'à-coups.", "Ne force pas l'amplitude (tu tires sur l'aine)."], images: exUrl("Thigh_Adductor") },
].map((e) => {
  const muscle = exMuscleOverride[e.id] || (e.muscle === "Abdos" ? "Abdominaux" : e.muscle);
  return { ...e, muscle, type: e.type || exTypeOverride[e.id] || "Musculation", emoji: exGroupEmoji[muscle] || "🤸" };
});

// Normalise le matériel vers les choix du filtre (regroupe les variantes).
const exEquipNormalize = { "Barre EZ": "Barre", "Smith": "Machine" };
// Base complète (~870 exercices) avec photos réelles + filtres FR.
const exImportedFr = exercisesFrData.map((e) => ({
  id: e.id,
  name: e.name,
  muscle: e.muscle,
  type: e.type,
  equipment: exEquipNormalize[e.equipment] || e.equipment,
  level: e.level,
  targets: e.targets || [],
  steps: exGenericSteps(e.type, exEquipNormalize[e.equipment] || e.equipment, e.muscle),
  mistakes: exMistakesFor({ name: e.name, muscle: e.muscle, type: e.type, equipment: exEquipNormalize[e.equipment] || e.equipment }),
  images: exUrl(e.f),
  emoji: exGroupEmoji[e.muscle] || "🤸",
}));
// Fusion : mes 89 exercices rédigés en FR (instructions + À éviter) sont prioritaires ; le reste complète.
const exCuratedIds = new Set(exerciseLibraryFr.map((e) => e.id));
const exAllFr = [...exerciseLibraryFr, ...exImportedFr.filter((e) => !exCuratedIds.has(e.id))]
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

function ExercisesPage({ onBack, onGoToShop }) {
  const [tab, setTab] = useState("library");
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("Tous");
  const [exType, setExType] = useState("Tous");
  const [equipment, setEquipment] = useState("Tous");
  const [level, setLevel] = useState("Tous");
  const [favOnly, setFavOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => loadJSON("hm-exercise-favorites", []));
  const [session, setSession] = useState(() => loadJSON("hm-exercise-session", []));
  const [detail, setDetail] = useState(null);
  const [frame, setFrame] = useState(0);
  const [coachNotice, setCoachNotice] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef(null);
  const prevPhaseRef = useRef("idle");
  const [library] = useState(exAllFr);
  const loadingLib = false;
  const libError = false;
  const [visibleCount, setVisibleCount] = useState(48);

  const [log, setLog] = useState(() => loadJSON("hm-exercise-log", []));
  const [logExercise, setLogExercise] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [logWeight, setLogWeight] = useState("");
  const [logReps, setLogReps] = useState("");

  const [timerCfg, setTimerCfg] = useState({ work: 20, rest: 10, rounds: 8, label: "Tabata" });
  const [timer, setTimer] = useState({ phase: "idle", remaining: 20, round: 1, running: false });
  const [doneSession, setDoneSession] = useState([]);

  const persist = (key, val) => {
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
    }
  };

  // Séance en cours : les « tours » suivent les exercices de Ma séance (sinon le nombre du preset).
  const sessionExercises = session.map((id) => library.find((e) => e.id === id)).filter(Boolean);
  const runCfg = { work: timerCfg.work, rest: timerCfg.rest, rounds: sessionExercises.length || timerCfg.rounds, label: timerCfg.label };

  const playBeep = (freq = 880, dur = 0.18, vol = 0.3, type = "sine") => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch { /* ignore */ }
  };
  // Carillon doux et réconfortant pour le début du repos (notes descendantes).
  const playRestChime = () => {
    playBeep(659.25, 0.32, 0.22, "sine");
    setTimeout(() => playBeep(523.25, 0.38, 0.22, "sine"), 170);
    setTimeout(() => playBeep(392.0, 0.55, 0.20, "sine"), 360);
  };
  // Signal énergique et motivant pour le début du travail (notes montantes « GO »).
  const playWorkSignal = () => {
    playBeep(659.25, 0.12, 0.30, "triangle");
    setTimeout(() => playBeep(880.0, 0.12, 0.32, "triangle"), 130);
    setTimeout(() => playBeep(1046.5, 0.24, 0.34, "triangle"), 260);
  };

  useEffect(() => {
    if (!timer.running) return undefined;
    const id = setInterval(() => setTimer((t) => tickTimer(t, runCfg)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.running, runCfg.work, runCfg.rest, runCfg.rounds]);

  // Son au changement de phase : début travail / repos / fin de séance.
  useEffect(() => {
    if (timer.phase !== prevPhaseRef.current) {
      if (soundOn) {
        if (timer.phase === "work") playWorkSignal();
        else if (timer.phase === "rest") playRestChime();
        else if (timer.phase === "done") { playBeep(660, 0.25); setTimeout(() => playBeep(880, 0.4), 220); }
      }
      prevPhaseRef.current = timer.phase;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.phase, soundOn]);

  // Réinitialise la pagination quand les filtres changent.
  useEffect(() => { setVisibleCount(48); }, [search, muscle, exType, equipment, level, favOnly]);

  // Exercice par défaut du journal une fois la bibliothèque chargée.
  // (Le Journal utilise un champ de recherche : pas de sélection par défaut.)

  // Anime la démo (alterne photo de départ / photo finale) quand une fiche est ouverte.
  useEffect(() => {
    setFrame(0);
    setCoachNotice(false);
    if (!detail || !(detail.images && detail.images.length > 1)) return undefined;
    const id = setInterval(() => setFrame((f) => (f + 1) % detail.images.length), 800);
    return () => clearInterval(id);
  }, [detail]);

  const exerciseById = (id) => library.find((ex) => ex.id === id);
  // Lien de démonstration : la vidéo/GIF propre du coach si défini (champ `video`), sinon une
  // recherche YouTube ciblée pour voir les gestes corrects de l'exercice.
  const demoMediaUrl = (ex) => ex?.video || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${ex?.name || ""} exercice technique exécution`)}`;
  // Recherche YouTube (plusieurs vidéos) de l'exercice + vidéo perso du coach Hicham (si fournie).
  const youtubeUrl = (ex) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${ex?.name || ""} exercice technique`)}`;
  const coachVid = (ex) => ex?.coachVideo || ex?.video || "";
  // Recommandation séries/répétitions/repos (réglage propre de l'exercice, sinon selon type/niveau).
  const recoFor = (ex) => {
    if (ex?.reco) return ex.reco;
    if (ex?.type === "Mobilité") return { volume: "2 à 3 séries × 30 secondes", repos: "Repos : 15 à 30 secondes" };
    if (ex?.type === "Cardio") return { volume: "4 à 6 tours × 30 à 45 sec d'effort", repos: "Repos : 15 à 30 secondes" };
    if (ex?.type === "Corps complet") return { volume: "4 séries × 8 à 10 répétitions", repos: "Repos : 90 à 120 secondes" };
    if (ex?.level === "Débutant") return { volume: "3 séries × 10 à 12 répétitions", repos: "Repos : 60 à 90 secondes" };
    if (ex?.level === "Avancé") return { volume: "4 à 5 séries × 6 à 10 répétitions", repos: "Repos : 90 à 120 secondes" };
    return { volume: "4 séries × 8 à 12 répétitions", repos: "Repos : 90 secondes" };
  };
  const isDirectMedia = (url) => /\.(gif|mp4|webm)(\?|$)/i.test(url || "");
  const levelBadgeCls = (lvl) =>
    lvl === "Débutant" ? "bg-emerald-100 text-emerald-700"
      : lvl === "Intermédiaire" ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

  const toggleFavorite = (id) => {
    setFavorites((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      persist("hm-exercise-favorites", next);
      return next;
    });
  };
  const toggleSession = (id) => {
    setSession((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      persist("hm-exercise-session", next);
      return next;
    });
  };
  const clearSession = () => { setSession([]); persist("hm-exercise-session", []); setDoneSession([]); };
  const removeFromSession = (id) => {
    setSession((cur) => { const next = cur.filter((x) => x !== id); persist("hm-exercise-session", next); return next; });
    setDoneSession((cur) => cur.filter((x) => x !== id));
  };
  // Réordonne un exercice dans la séance (dir = -1 monter, +1 descendre).
  const moveInSession = (id, dir) => {
    setSession((cur) => {
      const idx = cur.indexOf(id);
      const to = idx + dir;
      if (idx < 0 || to < 0 || to >= cur.length) return cur;
      const next = [...cur];
      [next[idx], next[to]] = [next[to], next[idx]];
      persist("hm-exercise-session", next);
      return next;
    });
  };

  const addLogEntry = () => {
    const w = Number(logWeight);
    const r = Number(logReps);
    if (!logExercise || !(w >= 0) || !(r > 0)) return;
    const entry = { id: `${Date.now()}`, exerciseId: logExercise, weight: w, reps: r, date: new Date().toISOString() };
    setLog((cur) => {
      const next = [entry, ...cur];
      persist("hm-exercise-log", next);
      return next;
    });
    setLogWeight("");
    setLogReps("");
  };
  const deleteLogEntry = (id) => {
    setLog((cur) => {
      const next = cur.filter((e) => e.id !== id);
      persist("hm-exercise-log", next);
      return next;
    });
  };

  const applyPreset = (cfg) => {
    setTimerCfg(cfg);
    setTimer({ phase: "idle", remaining: cfg.work, round: 1, running: false });
    setDoneSession([]);
  };
  const startOrResume = () => {
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    setTimer((t) => (t.phase === "idle" || t.phase === "done")
      ? { phase: "work", remaining: runCfg.work, round: 1, running: true }
      : { ...t, running: true });
  };
  const pauseTimer = () => setTimer((t) => ({ ...t, running: false }));
  const resetTimer = () => setTimer({ phase: "idle", remaining: runCfg.work, round: 1, running: false });
  const endSession = () => { setTimer({ phase: "idle", remaining: runCfg.work, round: 1, running: false }); clearSession(); };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const muscleOptions = ["Tous", ...exMuscleGroupsFr];
  const equipmentOptions = exEquipmentOptions;
  const levelOptions = ["Tous", ...["Débutant", "Intermédiaire", "Avancé"].filter((l) => library.some((e) => e.level === l))];

  const filteredExercises = library.filter((ex) => {
    // Favoris + tous les autres filtres s'appliquent ensemble (on peut affiner ses favoris).
    if (favOnly && !favorites.includes(ex.id)) return false;
    if (muscle !== "Tous" && ex.muscle !== muscle) return false;
    if (exType !== "Tous" && ex.type !== exType) return false;
    if (equipment !== "Tous" && ex.equipment !== equipment) return false;
    if (level !== "Tous" && ex.level !== level) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = [ex.name, ex.muscle, ex.equipment, ex.level, ...ex.targets].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Défilement infini : charge plus d'exercices en approchant du bas de la liste.
  const handleExScroll = (e) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 600 && visibleCount < filteredExercises.length) {
      setVisibleCount((c) => c + 36);
    }
  };

  // Records (PR) : meilleure charge par exercice.
  const maxByExercise = {};
  log.forEach((e) => { maxByExercise[e.exerciseId] = Math.max(maxByExercise[e.exerciseId] || 0, Number(e.weight) || 0); });
  const isPR = (e) => Number(e.weight) > 0 && Number(e.weight) === maxByExercise[e.exerciseId];

  const phaseLabel = timer.phase === "work" ? "💪 Travail"
    : timer.phase === "rest" ? "😮‍💨 Repos"
      : timer.phase === "done" ? "✅ Terminé"
        : "Prêt ?";
  const phaseColor = timer.phase === "work" ? "text-brand-300"
    : timer.phase === "rest" ? "text-sky-300"
      : timer.phase === "done" ? "text-emerald-300"
        : "text-slate-300";

  const chipBtn = (active) =>
    `rounded-xl px-3 py-1.5 text-xs font-black transition ${active ? "border-2 border-brand-300 bg-brand-400 text-slate-950" : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"}`;

  const cartCount = (() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = window.localStorage.getItem("hm-shop-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="settings-hero shrink-0">
        <div className="settings-hero__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
            <path d="M6.5 6.5 17.5 17.5M4 9l2-2M20 15l-2 2M9 4 7 6M17 20l-2-2M3 14l4 4M21 10l-4-4" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="settings-hero__title">Exercices</h1>
          <p className="settings-hero__subtitle">Explorez les exercices sélectionnés par Coach Hicham, lancez vos séances et suivez vos progrès jour après jour.</p>
        </div>
        <div className="settings-hero__actions" aria-label="Actions rapides">
          {onBack ? (
            <button type="button" onClick={onBack} className="settings-hero__back" aria-label="Revenir en arrière" title="Revenir en arrière">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
                <path d="M9 12h11" />
              </svg>
              <span>Retour</span>
            </button>
          ) : null}
          <button type="button" onClick={onGoToShop} className="settings-hero__action" aria-label="Panier" title="Voir le panier (boutique)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-white">{cartCount}</span>
            ) : null}
          </button>
          <CoachInbox />
        </div>
      </div>

      {/* Onglets */}
      <div className="mt-2 flex shrink-0 gap-1">
        {[
          ["library", "Bibliothèque", (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15Z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v5H6.5A2.5 2.5 0 0 1 4 19.5Z" /><path d="M9 6h7M9 9.5h7" /></svg>
          )],
          ["timer", "Minuteur", (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true"><path d="M9 2h6" /><path d="M12 5v3" /><circle cx="12" cy="14" r="8" /><path d="M12 14l3-2" /><path d="m18.5 7.5 1.5-1.5" /></svg>
          )],
          ["journal", "Journal", (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m7 14 3.5-3.5 3 3L21 7" /><path d="M21 11V7h-4" /></svg>
          )],
        ].map(([value, label, icon]) => (
          <button key={value} type="button" onClick={() => setTab(value)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${tab === value ? "border-2 border-brand-300 bg-brand-400 text-slate-950" : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"}`}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div onScroll={handleExScroll} className="settings-scroll mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {tab === "library" ? (
          <div className="settings-card shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un exercice…" className="w-full rounded-xl border border-slate-600/65 bg-slate-950/45 py-2 pl-9 pr-3 text-sm font-bold text-white outline-none focus:border-brand-300" />
              </div>
              <button type="button" onClick={() => setFavOnly((v) => !v)} className={chipBtn(favOnly)}>❤️ Favoris{favorites.length ? ` (${favorites.length})` : ""}</button>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-200">Parties du corps</p>
                <div className="flex flex-wrap gap-1">{muscleOptions.map((m) => (<button key={m} type="button" onClick={() => setMuscle(m)} className={chipBtn(muscle === m)}>{m}</button>))}</div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-200">Type</p>
                <div className="flex flex-wrap gap-1">{exTypeOptions.map((m) => (<button key={m} type="button" onClick={() => setExType(m)} className={chipBtn(exType === m)}>{m}</button>))}</div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-200">Matériel</p>
                <div className="flex flex-wrap gap-1">{equipmentOptions.map((m) => (<button key={m} type="button" onClick={() => setEquipment(m)} className={chipBtn(equipment === m)}>{m}</button>))}</div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-200">Niveau</p>
                <div className="flex flex-wrap gap-1">{levelOptions.map((m) => (<button key={m} type="button" onClick={() => setLevel(m)} className={chipBtn(level === m)}>{m}</button>))}</div>
              </div>
            </div>

            {session.length ? (
              <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-brand-400/45 bg-brand-500/10 px-4 py-2.5">
                <span className="text-sm font-black text-white">🏋️ Ma séance · {session.length} exercice(s)</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTab("timer")} className="rounded-xl border-2 border-brand-300 bg-brand-400 px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-brand-300">Démarrer</button>
                  <button type="button" onClick={clearSession} className="rounded-xl border border-slate-600/65 bg-slate-950/35 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-rose-400 hover:text-rose-300">Vider</button>
                </div>
              </div>
            ) : null}

            {loadingLib ? (
              <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600/40 border-t-brand-400" />
                <p className="text-sm font-bold text-slate-300">Chargement de la bibliothèque d'exercices…</p>
              </div>
            ) : filteredExercises.length ? (
              <>
                <p className="mt-3 text-xs font-bold text-slate-400">{filteredExercises.length} exercice(s){libError ? " · mode hors-ligne" : ""}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredExercises.slice(0, visibleCount).map((ex) => {
                    const fav = favorites.includes(ex.id);
                    const inSession = session.includes(ex.id);
                    return (
                      <div key={ex.id} onClick={() => setDetail(ex)} className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-950/40 transition hover:border-brand-300/70">
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleFavorite(ex.id); }} aria-label="Favori" className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition ${fav ? "border-rose-300 bg-rose-100 text-rose-600" : "border-white/40 bg-black/30 text-white hover:text-rose-300"}`}>{fav ? "❤️" : "🤍"}</button>
                        <div className="relative h-28 w-full shrink-0 bg-white">
                          {ex.images && ex.images[0] ? (
                            <img src={ex.images[0]} alt={ex.name} loading="lazy" className="h-full w-full object-contain" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-4xl">{ex.emoji}</span>
                          )}
                          <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-400 text-slate-950 shadow" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3.5 w-3.5"><path d="M8 5v14l11-7z" /></svg>
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-3">
                          <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-sm font-black leading-tight text-white">{ex.name}</h3>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            <span className="rounded-lg border border-brand-300/40 bg-brand-400/15 px-1.5 py-0.5 text-[9px] font-black text-brand-200">{ex.muscle}</span>
                            <span className={`rounded-lg px-1.5 py-0.5 text-[9px] font-black ${levelBadgeCls(ex.level)}`}>{ex.level}</span>
                          </div>
                          <p className="mt-1.5 text-[11px] font-semibold text-slate-400">{ex.equipment}{ex.sets ? ` · ${ex.sets}` : ""}</p>
                          <button type="button" onClick={(e) => { e.stopPropagation(); toggleSession(ex.id); }} className={`mt-auto w-full rounded-lg px-2 py-1.5 text-[10px] font-black transition ${inSession ? "border border-brand-300/60 bg-brand-400/20 text-brand-100" : "border border-slate-600/65 bg-slate-950/35 text-slate-300 hover:border-brand-300/70 hover:text-brand-100"}`}>{inSession ? "✓ Dans la séance" : "+ Séance"}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredExercises.length > visibleCount ? (
                  <div className="mt-3 flex justify-center">
                    <button type="button" onClick={() => setVisibleCount((c) => c + 48)} className="rounded-xl border border-slate-600/65 bg-slate-950/35 px-5 py-2 text-sm font-black text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100">Charger plus</button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-300">{favOnly && !favorites.length ? "Aucun favori pour l'instant. Appuie sur ❤️ sur une carte (ou dans une fiche) pour l'ajouter ici." : favOnly ? "Aucun favori ne correspond à ces filtres." : "Aucun exercice ne correspond à ces filtres."}</p>
            )}
          </div>
        ) : null}

        {tab === "timer" ? (
          <div className="settings-card flex flex-col items-center shrink-0">
            <div className="flex flex-wrap justify-center gap-1.5">
              <button type="button" onClick={() => applyPreset({ work: 20, rest: 10, rounds: 8, label: "Tabata" })} className={chipBtn(timerCfg.label === "Tabata")}>Tabata (20/10 ×8)</button>
              <button type="button" onClick={() => applyPreset({ work: 60, rest: 0, rounds: 10, label: "EMOM" })} className={chipBtn(timerCfg.label === "EMOM")}>EMOM (60s ×10)</button>
              <button type="button" onClick={() => applyPreset({ work: 40, rest: 20, rounds: 6, label: "Perso" })} className={chipBtn(timerCfg.label === "Perso")}>Personnalisé</button>
            </div>

            {timerCfg.label === "Perso" ? (
              <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-300">
                {[["Travail (s)", "work"], ["Repos (s)", "rest"], ["Tours", "rounds"]].map(([lbl, field]) => (
                  <label key={field} className="flex flex-col items-center">
                    <span>{lbl}</span>
                    <input type="number" min={field === "rest" ? 0 : 1} value={timerCfg[field]} onChange={(e) => { const v = Math.max(field === "rest" ? 0 : 1, Number(e.target.value) || 0); const next = { ...timerCfg, [field]: v }; setTimerCfg(next); setTimer({ phase: "idle", remaining: next.work, round: 1, running: false }); }} className="mt-1 w-20 rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-center text-sm font-bold text-white outline-none focus:border-brand-300" />
                  </label>
                ))}
              </div>
            ) : null}

            {sessionExercises.length ? (
              <div className="mt-4 w-full max-w-md rounded-2xl border border-brand-400/40 bg-brand-500/10 p-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-200">Exercice actuel</p>
                <p className="font-display text-lg font-black leading-tight text-white">{(sessionExercises[Math.min(timer.round, sessionExercises.length) - 1] || sessionExercises[0]).name}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Prochain exercice</p>
                <p className="text-sm font-bold text-slate-200">{sessionExercises[timer.round] ? sessionExercises[timer.round].name : "— Dernier exercice 💪"}</p>
              </div>
            ) : null}

            <div className="relative mt-5 flex h-52 w-52 items-center justify-center rounded-full border-4 border-slate-600/40">
              <div className={`absolute inset-2 rounded-full ${timer.phase === "work" ? "bg-brand-400/10" : timer.phase === "rest" ? "bg-sky-400/10" : "bg-slate-500/10"} ${timer.running ? "animate-pulse" : ""}`} />
              <div className="relative text-center">
                <p className={`text-sm font-black uppercase tracking-wide ${phaseColor}`}>{phaseLabel}</p>
                <p className="font-display text-5xl font-black text-white">{formatTime(timer.remaining)}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">Tour {timer.round} / {runCfg.rounds}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-bold text-slate-300">
              <span>Travail : <span className="text-brand-200">{runCfg.work} sec</span></span>
              <span>Repos : <span className="text-sky-300">{runCfg.rest} sec</span></span>
              <span>Tour : <span className="text-white">{timer.round} / {runCfg.rounds}</span></span>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {timer.running ? (
                <button type="button" onClick={pauseTimer} className="rounded-2xl border-2 border-amber-300 bg-amber-100 px-5 py-2.5 text-sm font-black text-amber-800 transition hover:bg-amber-200">⏸ Pause</button>
              ) : (
                <button type="button" onClick={startOrResume} className="rounded-2xl border-2 border-brand-300 bg-brand-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-brand-300">▶ {timer.phase === "idle" || timer.phase === "done" ? "Démarrer" : "Reprendre"}</button>
              )}
              <button type="button" onClick={resetTimer} className="rounded-2xl border border-slate-600/65 bg-slate-950/35 px-5 py-2.5 text-sm font-black text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100">↺ Réinitialiser</button>
              <button type="button" onClick={() => setSoundOn((v) => !v)} className={`rounded-2xl border-2 px-5 py-2.5 text-sm font-black transition ${soundOn ? "border-brand-300 bg-brand-400/15 text-brand-100" : "border-slate-600/65 bg-slate-950/35 text-slate-300"}`}>{soundOn ? "🔊 Son" : "🔇 Son"}</button>
              {sessionExercises.length ? (
                <button type="button" onClick={endSession} className="rounded-2xl border-2 border-rose-300 bg-rose-100 px-5 py-2.5 text-sm font-black text-rose-700 transition hover:bg-rose-200">⏹ Terminer la séance</button>
              ) : null}
            </div>

            {session.length ? (
              <div className="mt-6 w-full max-w-md">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-200">Ma séance</p>
                  <p className="text-[10px] text-slate-400">Réordonne avec ⬆⬇ · touche pour la fiche · coche « Fait »</p>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {session.map((id, idx) => {
                    const ex = exerciseById(id);
                    if (!ex) return null;
                    const done = doneSession.includes(id);
                    const isCurrent = timer.running && idx === timer.round - 1;
                    return (
                      <li key={id} className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition ${done ? "border-emerald-300/50 bg-emerald-500/10" : isCurrent ? "border-brand-300 bg-brand-400/15 ring-2 ring-brand-300/60" : "border-slate-600/55 bg-slate-950/35"}`}>
                        <div className="flex shrink-0 flex-col">
                          <button type="button" onClick={() => moveInSession(id, -1)} disabled={idx === 0} aria-label="Monter" className="flex h-4 w-5 items-center justify-center rounded text-slate-400 transition hover:text-brand-200 disabled:opacity-25">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
                          </button>
                          <button type="button" onClick={() => moveInSession(id, 1)} disabled={idx === session.length - 1} aria-label="Descendre" className="flex h-4 w-5 items-center justify-center rounded text-slate-400 transition hover:text-brand-200 disabled:opacity-25">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                          </button>
                        </div>
                        <span className="w-4 shrink-0 text-center text-xs font-black text-slate-500">{idx + 1}</span>
                        <button type="button" onClick={() => setDetail(ex)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Voir ${ex.name}`}>
                          {ex.images && ex.images[0] ? (
                            <img src={ex.images[0]} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-cover" />
                          ) : (
                            <span className="text-xl">{ex.emoji}</span>
                          )}
                          <span className={`min-w-0 flex-1 truncate text-sm font-bold ${done ? "text-slate-400 line-through" : "text-white"}`}>{ex.name}{isCurrent ? <span className="ml-2 text-[10px] font-black text-brand-200">● EN COURS</span> : null}</span>
                        </button>
                        <button type="button" onClick={() => setDoneSession((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])} aria-label={done ? "Marquer comme non fait" : "Marquer comme fait"} className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black transition ${done ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-slate-500 bg-slate-950/40 text-slate-300 hover:border-emerald-300 hover:text-emerald-200"}`}>
                          <span className="flex h-4 w-4 items-center justify-center rounded border border-current text-[10px]">{done ? "✓" : ""}</span>
                          {done ? "Fait" : "Fait ?"}
                        </button>
                        <button type="button" onClick={() => removeFromSession(id)} aria-label={`Supprimer ${ex.name} de la séance`} title="Supprimer de la séance" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-600/65 bg-slate-950/40 text-slate-400 transition hover:border-rose-400 hover:text-rose-300">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="mt-6 text-center text-xs text-slate-400">Ajoutez vos exercices depuis la bibliothèque, lancez le minuteur et suivez votre progression pendant la séance.</p>
            )}
          </div>
        ) : null}

        {tab === "journal" ? (
          <div className="settings-card shrink-0">
            <div className="flex flex-wrap items-end gap-2">
              <div className="relative min-w-[180px] flex-1 text-xs font-semibold text-slate-300">
                <span>Exercice</span>
                <input
                  value={logSearch}
                  onChange={(e) => { setLogSearch(e.target.value); setLogOpen(true); }}
                  onFocus={() => setLogOpen(true)}
                  onBlur={() => setTimeout(() => setLogOpen(false), 150)}
                  placeholder="🔎 Tape le nom de l'exercice…"
                  className="mt-1 block w-full rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300"
                />
                {logOpen ? (
                  <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-600/65 bg-slate-950 shadow-[0_20px_50px_rgba(2,6,23,0.6)]">
                    {(() => {
                      const q = logSearch.trim().toLowerCase();
                      if (!q) return <p className="px-3 py-3 text-xs text-slate-400">Tape le nom d'un exercice pour le trouver…</p>;
                      const list = library.filter((ex) => ex.name.toLowerCase().includes(q)).slice(0, 40);
                      if (!list.length) return <p className="px-3 py-3 text-xs text-slate-400">Aucun exercice trouvé.</p>;
                      return list.map((ex) => (
                        <button key={ex.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setLogExercise(ex.id); setLogSearch(ex.name); setLogOpen(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold transition hover:bg-slate-800 ${logExercise === ex.id ? "text-brand-200" : "text-white"}`}>
                          {ex.images && ex.images[0] ? <img src={ex.images[0]} alt="" className="h-6 w-6 shrink-0 rounded bg-white object-cover" /> : <span className="text-base">{ex.emoji}</span>}
                          <span className="min-w-0 flex-1 truncate">{ex.name}</span>
                          <span className="shrink-0 text-[10px] text-slate-400">{ex.muscle}</span>
                        </button>
                      ));
                    })()}
                  </div>
                ) : null}
              </div>
              <label className="text-xs font-semibold text-slate-300">
                <span>Charge (kg)</span>
                <input type="number" min="0" value={logWeight} onChange={(e) => setLogWeight(e.target.value)} placeholder="60" className="mt-1 block w-24 rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300" />
              </label>
              <label className="text-xs font-semibold text-slate-300">
                <span>Répétitions</span>
                <input type="number" min="1" value={logReps} onChange={(e) => setLogReps(e.target.value)} placeholder="8" className="mt-1 block w-24 rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300" />
              </label>
              <button type="button" onClick={addLogEntry} className="rounded-xl border-2 border-brand-300 bg-brand-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-brand-300">Ajouter</button>
            </div>

            {log.length ? (
              <ul className="mt-4 space-y-1.5">
                {log.map((e) => {
                  const ex = exerciseById(e.exerciseId);
                  return (
                    <li key={e.id} className="flex items-center gap-3 rounded-xl border border-slate-600/55 bg-slate-950/35 px-3 py-2">
                      {ex && ex.images && ex.images[0] ? (
                        <img src={ex.images[0]} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-cover" />
                      ) : (
                        <span className="text-xl">{ex?.emoji || "🏋️"}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">{ex?.name || "Exercice"}{isPR(e) ? <span className="ml-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-700">🏆 Record</span> : null}</p>
                        <p className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      </div>
                      <span className="shrink-0 font-display text-sm font-black text-brand-200">{e.weight} kg × {e.reps}</span>
                      <button type="button" onClick={() => deleteLogEntry(e.id)} aria-label="Supprimer" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600/65 bg-slate-950/45 text-slate-400 transition hover:border-rose-400 hover:text-rose-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-6 text-center">
                <p className="font-display text-base font-black text-white">Ton journal est vide</p>
                <p className="mt-1 text-sm text-slate-300">Enregistre tes charges et répétitions pour suivre ta progression et battre tes records 🏆.</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {detail && typeof document !== "undefined"
        ? createPortal(
          <div className="fixed inset-0 z-[95] grid place-items-center p-4" style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }} role="dialog" aria-modal="true" aria-label={detail.name} onClick={() => setDetail(null)}>
            <div className="flex max-h-[88vh] w-[min(100%,34rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-4">
                {detail.images && detail.images[0] ? (
                  <img src={detail.images[0]} alt={detail.name} className="h-12 w-12 shrink-0 rounded-2xl bg-white object-cover" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400/30 to-emerald-500/15 text-3xl">{detail.emoji}</span>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-black text-slate-900">{detail.name}</h2>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    <span className="rounded-lg border border-brand-300/50 bg-brand-50 px-1.5 py-0.5 text-[10px] font-black text-brand-600">{detail.muscle}</span>
                    <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-black ${levelBadgeCls(detail.level)}`}>{detail.level}</span>
                    <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600">{detail.equipment}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setDetail(null)} aria-label="Fermer" className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {/* Démonstration : photos RÉELLES du mouvement animées (début ↔ fin) + vidéo complète */}
                <div className="relative mb-4 h-56 w-full overflow-hidden rounded-2xl bg-white">
                  {detail.video && isDirectMedia(detail.video) ? (
                    /\.(mp4|webm)(\?|$)/i.test(detail.video)
                      ? <video src={detail.video} className="h-full w-full bg-slate-900 object-contain" controls autoPlay loop muted playsInline />
                      : <img src={detail.video} alt={`Démonstration ${detail.name}`} className="h-full w-full object-contain" />
                  ) : detail.images && detail.images.length ? (
                    <img src={detail.images[frame] || detail.images[0]} alt={`Démonstration ${detail.name}`} className="h-full w-full object-contain transition-opacity" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-7xl">{detail.emoji}</span>
                  )}
                  {detail.images && detail.images.length > 1 ? (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-black text-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" /> Démo animée
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => window.open(youtubeUrl(detail), "_blank", "noopener,noreferrer")} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-100">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>
                    Vidéos YouTube
                  </button>
                  <button type="button" onClick={() => { const c = coachVid(detail); if (c) { window.open(c, "_blank", "noopener,noreferrer"); } else { setCoachNotice(true); } }} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-brand-300 bg-brand-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-brand-300">
                    🎥 Vidéo du coach
                  </button>
                </div>
                {coachNotice && !coachVid(detail) ? (
                  <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">🎥 Le coach Hicham n'a pas encore ajouté sa vidéo démonstrative pour cet exercice.</p>
                ) : null}

                <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-wide text-brand-600">Recommandation</p>
                  <p className="mt-0.5 font-display text-base font-black text-slate-900">{recoFor(detail).volume}</p>
                  <p className="text-sm font-semibold text-slate-600">{recoFor(detail).repos}</p>
                </div>

                {detail.targets && detail.targets.length ? (
                  <>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-slate-400">Muscles sollicités</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {detail.targets.map((t) => (<span key={t} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{t}</span>))}
                    </div>
                  </>
                ) : null}

                {detail.steps && detail.steps.length ? (
                  <>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-slate-400">Comment faire</p>
                    <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                      {detail.steps.map((s, i) => (<li key={i}>{s}</li>))}
                    </ol>
                  </>
                ) : null}

                <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-rose-400">À éviter</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(detail.mistakes && detail.mistakes.length ? detail.mistakes : exMistakesFor(detail)).map((s, i) => (<li key={i}>{s}</li>))}
                </ul>

                {detail.variants ? (
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <p className="text-[11px] font-black uppercase tracking-wide text-emerald-600">Plus facile</p>
                      <p className="mt-0.5 text-sm text-slate-700">{detail.variants.easier}</p>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5">
                      <p className="text-[11px] font-black uppercase tracking-wide text-rose-600">Plus difficile</p>
                      <p className="mt-0.5 text-sm text-slate-700">{detail.variants.harder}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 border-t border-slate-200 px-5 py-3">
                <button type="button" onClick={() => toggleFavorite(detail.id)} className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-black transition ${favorites.includes(detail.id) ? "border-rose-300 bg-rose-100 text-rose-700" : "border-slate-300 bg-white text-slate-700 hover:border-rose-300"}`}>{favorites.includes(detail.id) ? "❤️ Favori" : "🤍 Favori"}</button>
                <button type="button" onClick={() => toggleSession(detail.id)} className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-black transition ${session.includes(detail.id) ? "border-brand-300 bg-brand-100 text-brand-700" : "border-slate-300 bg-white text-slate-700 hover:border-brand-300"}`}>{session.includes(detail.id) ? "✓ Séance" : "+ Séance"}</button>
                <button type="button" onClick={() => { setLogExercise(detail.id); setLogSearch(detail.name); setTab("journal"); setDetail(null); }} className="flex-1 rounded-xl border-2 border-brand-300 bg-brand-400 px-3 py-2 text-sm font-black text-slate-950 transition hover:bg-brand-300">📈 Journal</button>
              </div>
            </div>
          </div>,
          document.body
        ) : null}
    </section>
  );
}

function AppointmentsPage({ onBack, onGoToShop, customerEmail }) {
  const [now, setNow] = useState(() => new Date());
  const todayKey = toDateKey(now);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [pendingSlot, setPendingSlot] = useState(null);
  const [pendingMode, setPendingMode] = useState("video");
  const [pendingCancelId, setPendingCancelId] = useState(null);
  const [apptDateFrom, setApptDateFrom] = useState("");
  const [apptDateTo, setApptDateTo] = useState("");
  const [apptSortDesc, setApptSortDesc] = useState(true);
  const [apptStatusFilter, setApptStatusFilter] = useState("all");
  const [activeCallId, setActiveCallId] = useState(null);
  const slotsScrollRef = useRef(null);
  const scrollSlots = (direction) => {
    if (slotsScrollRef.current) {
      slotsScrollRef.current.scrollBy({ left: direction * 220, behavior: "smooth" });
    }
  };
  const [appointments, setAppointments] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-appointments");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const persistAppointments = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-appointments", JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
    }
    return next;
  };

  const longDateLabel = (key) =>
    new Date(`${key}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" });
  const dayBeforeLabel = (key) => {
    const d = new Date(`${key}T00:00:00`);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });
  };
  const modeLabel = (mode) => (mode === "vocal" ? "appel vocal" : "appel vidéo");
  // E-mail SIMULÉ via une notification (📧). Un vrai envoi nécessite un backend/service mail.
  const sendEmail = (subject, detail) =>
    addShopNotification(`📧 ${subject}${customerEmail ? ` (${customerEmail})` : ""} — ${detail}`);

  const apptStart = (appt) => appointmentStartAt(appt);
  const apptEnd = (appt) => apptStart(appt) + coachSlotDurationMin * 60000;
  const getApptStatus = (appt) => getAppointmentStatus(appt, now);
  const canJoin = (appt) => canJoinScheduledAppointment(appt, now);

  const isSlotBooked = (key, time) =>
    appointments.some((item) => !item.cancelled && item.date === key && item.time === time);
  // On ne peut réserver QUE pour un jour strictement futur : le jour courant (et le passé) n'est pas
  // réservable. Dès qu'une journée commence, ses créneaux disparaissent et deviennent indisponibles.
  // On retire aussi les créneaux déjà réservés (donc masqués aux autres).
  const availableSlotsForDate = (key) =>
    key > todayKey ? slotsForDateKey(key).filter((time) => !isSlotBooked(key, time)) : [];
  const isDateAvailable = (key) => key > todayKey && availableSlotsForDate(key).length > 0;

  // Un rendez-vous bloque une nouvelle réservation TANT QUE son créneau n'est pas terminé ET qu'il
  // n'est pas annulé (manuel ou auto). Dès que l'heure de fin passe (ex. 16:00 pour un créneau
  // 15:00-16:00), ou qu'il est annulé / annulé automatiquement, l'utilisateur peut de nouveau réserver.
  const activeAppointments = appointments.filter(
    (item) => !item.cancelled && now.getTime() < apptEnd(item)
  );
  const hasActiveAppointment = activeAppointments.length > 0;

  const nextApptNumber = () => {
    const max = appointments.reduce((acc, item) => {
      const n = parseInt(String(item.number || "").replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `RDV-${String(max + 1).padStart(3, "0")}`;
  };

  const requestBooking = (key, time) => {
    if (hasActiveAppointment || isSlotBooked(key, time)) return;
    setPendingMode("video");
    setPendingSlot({ date: key, time });
  };
  const confirmBooking = () => {
    if (!pendingSlot || hasActiveAppointment || isSlotBooked(pendingSlot.date, pendingSlot.time)) {
      setPendingSlot(null);
      return;
    }
    const appt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      number: nextApptNumber(),
      date: pendingSlot.date,
      time: pendingSlot.time,
      mode: pendingMode,
      createdAt: new Date().toISOString(),
      cancelled: false,
      joined: false,
      reminderSent: false
    };
    setAppointments(persistAppointments([...appointments, appt]));
    sendEmail(
      "Confirmation de rendez-vous",
      `Le ${longDateLabel(appt.date)} à ${formatLocalSlotRange(appt.date, appt.time)} en ${modeLabel(appt.mode)} avec Coach Hicham. Vous pouvez annuler jusqu'au ${dayBeforeLabel(appt.date)} 23:59, sans quoi le rendez-vous sera confirmé.`
    );
    setPendingSlot(null);
  };

  const cancelAppointment = (id, auto = false) => {
    const target = appointments.find((item) => item.id === id && !item.cancelled);
    if (!target) return;
    // Annulation manuelle : on retire la ligne du tableau.
    // Annulation automatique (absence) : on la conserve avec le statut « Annulé ».
    const next = auto
      ? appointments.map((item) => (item.id === id ? { ...item, cancelled: true, autoCancelled: true } : item))
      : appointments.filter((item) => item.id !== id);
    setAppointments(persistAppointments(next));
    if (activeCallId === id) setActiveCallId(null);
    // Annulation manuelle par l'athlète : PAS de notification.
    // Seule l'annulation automatique (absence) déclenche une notification.
    if (auto) {
      sendEmail(
        "Rendez-vous annulé automatiquement",
        `Vous n'avez pas rejoint le ${longDateLabel(target.date)} à ${formatLocalSlotRange(target.date, target.time)}. Le rendez-vous a été annulé.`
      );
    }
  };

  const joinAppointment = (id) => {
    setAppointments((current) => persistAppointments(current.map((item) => (item.id === id ? { ...item, joined: true } : item))));
    setActiveCallId(id);
  };

  useEffect(() => {
    const nowMs = now.getTime();
    let changed = false;
    const emails = [];
    const next = appointments.map((item) => {
      let updated = item;
      const start = apptStart(updated);
      // 1) Auto-annulation : rendez-vous non rejoint 10 min après le début.
      if (!updated.cancelled && !updated.joined && nowMs > start + 10 * 60000) {
        updated = { ...updated, cancelled: true, autoCancelled: true };
        changed = true;
        emails.push(["Rendez-vous annulé automatiquement", `Vous n'avez pas rejoint le ${longDateLabel(item.date)} à ${formatLocalSlotRange(item.date, item.time)}. Le rendez-vous a été annulé.`]);
      }
      // 2) Confirmation : le délai d'annulation (la veille à 23:59) est passé.
      const confirmAt = appointmentConfirmAt(item.date);
      if (!updated.cancelled && !updated.joined && !updated.confirmedNotified && nowMs >= confirmAt) {
        updated = { ...updated, confirmedNotified: true };
        changed = true;
        emails.push(["Rendez-vous confirmé", `Votre rendez-vous du ${longDateLabel(item.date)} à ${formatLocalSlotRange(item.date, item.time)} en ${modeLabel(item.mode)} avec Coach Hicham est confirmé.`]);
      }
      // 3) Rappel : moins de 2h avant le rendez-vous.
      if (!updated.cancelled && !updated.joined && !updated.reminderSent && nowMs >= start - 2 * 60 * 60000 && nowMs < start) {
        updated = { ...updated, reminderSent: true };
        changed = true;
        emails.push(["Rappel de rendez-vous", `Rappel : votre rendez-vous avec Coach Hicham est dans moins de 2h, à ${formatLocalSlotRange(item.date, item.time)} en ${modeLabel(item.mode)}.`]);
      }
      return updated;
    });
    if (changed) {
      setAppointments(persistAppointments(next));
      emails.forEach(([subject, detail]) => sendEmail(subject, detail));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = viewMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const canGoPrev = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());

  const selectedSlots = availableSlotsForDate(selectedDate);
  const selectedLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : "";

  const tableAppointments = appointments
    .slice()
    .filter((item) => {
      // item.date et les bornes sont au format YYYY-MM-DD → comparaison de chaînes valide.
      if (apptDateFrom && item.date < apptDateFrom) return false;
      if (apptDateTo && item.date > apptDateTo) return false;
      return true;
    })
    .filter((item) => {
      if (apptStatusFilter === "all") return true;
      const status = getApptStatus(item);
      if (apptStatusFilter === "cancelled") return status === "cancelled" || status === "expired";
      return status === apptStatusFilter;
    })
    .sort((a, b) => {
      const cmp = a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date);
      return apptSortDesc ? -cmp : cmp;
    });
  const activeCall = activeCallId ? appointments.find((item) => item.id === activeCallId) : null;

  const statusBadge = {
    upcoming: { label: "À venir", cls: "bg-emerald-100 text-emerald-700" },
    confirmed: { label: "Confirmé", cls: "bg-sky-100 text-sky-700" },
    joined: { label: "En cours", cls: "bg-brand-100 text-brand-700" },
    cancelled: { label: "Annulé", cls: "bg-rose-100 text-rose-700" },
    expired: { label: "Annulé", cls: "bg-rose-100 text-rose-700" }
  };

  const cartCount = (() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = window.localStorage.getItem("hm-shop-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="settings-hero shrink-0">
        <div className="settings-hero__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <circle cx="12" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="settings-hero__title">Rendez-vous</h1>
          <p className="settings-hero__subtitle">Choisissez un créneau pour discuter en vocal ou en vidéo avec le coach Hicham.</p>
        </div>
        <div className="settings-hero__actions" aria-label="Actions rapides">
          {onBack ? (
            <button type="button" onClick={onBack} className="settings-hero__back" aria-label="Revenir en arrière" title="Revenir en arrière">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
                <path d="M9 12h11" />
              </svg>
              <span>Retour</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onGoToShop}
            className="settings-hero__action"
            aria-label="Panier"
            title="Voir le panier (boutique)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          <CoachInbox />
        </div>
      </div>

      <div className="settings-scroll mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="settings-card">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => canGoPrev && setViewMonth(new Date(year, month - 1, 1))}
                disabled={!canGoPrev}
                aria-label="Mois précédent"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-600/65 bg-slate-950/35 text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M15 18 9 12l6-6" /></svg>
              </button>
              <span className="font-display text-base font-black capitalize text-white">{monthLabel}</span>
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                aria-label="Mois suivant"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-600/65 bg-slate-950/35 text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wide text-slate-400">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((date, idx) => {
                if (!date) return <span key={`empty-${idx}`} />;
                const key = toDateKey(date);
                const available = isDateAvailable(key);
                const isSelected = key === selectedDate;
                const isToday = key === todayKey;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedDate(key)}
                    title={available ? "Voir les créneaux" : "Indisponible"}
                    className={`relative flex h-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                      isSelected
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                        : available
                          ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 hover:bg-emerald-200"
                          : "cursor-not-allowed text-slate-400"
                    } ${isToday && !isSelected ? "ring-2 ring-emerald-500/60" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-300" /> Disponible</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-600" /> Sélectionné</span>
            </div>
          </div>

          <div className="settings-card flex flex-col">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-200">Créneaux du coach</p>
            <h2 className="font-display text-base font-black capitalize text-white">
              {selectedDate ? selectedLabel : "Horaires disponibles"}
            </h2>
            {hasActiveAppointment ? (
              <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm font-bold text-amber-800">
                Vous avez déjà un rendez-vous réservé. Annulez-le dans le tableau ci-dessous pour en réserver un autre.
              </div>
            ) : null}
            {selectedDate ? (
              selectedSlots.length ? (
                <>
                <div className="mt-3 flex items-center gap-1">
                  {selectedSlots.length > 3 ? (
                    <button
                      type="button"
                      onClick={() => scrollSlots(-1)}
                      aria-label="Créneaux précédents"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-600/65 bg-slate-950/35 text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M15 18 9 12l6-6" /></svg>
                    </button>
                  ) : null}
                  <div ref={slotsScrollRef} className="flex flex-1 gap-2 overflow-x-auto scroll-smooth pb-1" style={{ scrollbarWidth: "none" }}>
                    {selectedSlots.map((time) => (
                      <div key={time} className="w-36 shrink-0 rounded-2xl border border-brand-400/45 bg-brand-500/10 p-3 text-center">
                        <p className="flex items-center justify-center gap-1.5 font-display text-sm font-black text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-brand-200" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                          {formatLocalSlotRange(selectedDate, time)}
                        </p>
                        <button
                          type="button"
                          disabled={hasActiveAppointment}
                          onClick={() => requestBooking(selectedDate, time)}
                          className={`mt-2 w-full rounded-xl px-2 py-1.5 text-xs font-black transition ${
                            hasActiveAppointment
                              ? "cursor-not-allowed border border-slate-300 bg-slate-200 text-slate-500"
                              : "border-2 border-brand-300 bg-brand-400 text-slate-950 hover:bg-brand-300"
                          }`}
                        >
                          Réserver
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedSlots.length > 3 ? (
                    <button
                      type="button"
                      onClick={() => scrollSlots(1)}
                      aria-label="Créneaux suivants"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-600/65 bg-slate-950/35 text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 rounded-2xl border border-sky-200 bg-sky-100 px-4 py-3 text-xs font-bold text-sky-800">
                  ℹ️ Vous pouvez rejoindre le salon jusqu'à 10 minutes avant l'heure de votre rendez-vous. Sans connexion dans les 10 minutes qui suivent l'heure prévue, le rendez-vous sera annulé automatiquement.
                </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-slate-300">Aucun créneau disponible pour cette date.</p>
              )
            ) : (
              <div className="mt-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-400/40 bg-brand-500/10 text-brand-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                </div>
                <p className="mt-3 font-display text-base font-black text-white">Sélectionnez une date</p>
                <p className="mt-1 text-sm text-slate-300">Cliquez sur une date en vert dans le calendrier pour afficher les horaires proposés par le coach.</p>
              </div>
            )}
          </div>
        </div>

        <div className="settings-card">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-200">Mes rendez-vous</p>
          <h2 className="font-display text-base font-black text-white">Rendez-vous réservés</h2>
          <>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="text-xs font-semibold text-slate-300">
                  <span>Date début</span>
                  <input
                    type="date"
                    value={apptDateFrom}
                    max={apptDateTo || undefined}
                    onChange={(event) => setApptDateFrom(event.target.value)}
                    className="mt-1 block rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-300">
                  <span>Date fin</span>
                  <input
                    type="date"
                    value={apptDateTo}
                    min={apptDateFrom || undefined}
                    onChange={(event) => setApptDateTo(event.target.value)}
                    className="mt-1 block rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300"
                  />
                </label>
                <div className="text-xs font-semibold text-slate-300">
                  <span>Trier par date</span>
                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setApptSortDesc(true)}
                      className={`rounded-xl px-3 py-2 text-xs font-black transition ${apptSortDesc ? "border-2 border-brand-300 bg-brand-400 text-slate-950" : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"}`}
                    >
                      Plus récent
                    </button>
                    <button
                      type="button"
                      onClick={() => setApptSortDesc(false)}
                      className={`rounded-xl px-3 py-2 text-xs font-black transition ${!apptSortDesc ? "border-2 border-brand-300 bg-brand-400 text-slate-950" : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"}`}
                    >
                      Plus ancien
                    </button>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  <span>Statut</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {[["all", "Tous"], ["upcoming", "À venir"], ["confirmed", "Confirmé"], ["cancelled", "Annulé auto"]].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setApptStatusFilter(value)}
                        className={`rounded-xl px-3 py-2 text-xs font-black transition ${apptStatusFilter === value ? "border-2 border-brand-300 bg-brand-400 text-slate-950" : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {apptDateFrom || apptDateTo ? (
                  <button
                    type="button"
                    onClick={() => { setApptDateFrom(""); setApptDateTo(""); }}
                    className="rounded-xl border border-slate-600/65 bg-slate-950/35 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100"
                  >
                    Effacer les dates
                  </button>
                ) : null}
              </div>
          </>
          {tableAppointments.length ? (
            <div className="appt-scroll mt-3 max-h-[268px] overflow-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2">N°</th>
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2">Date</th>
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2">Heure</th>
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2">Type</th>
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2">Statut</th>
                    <th className="sticky top-0 z-10 border-b-2 border-slate-600/50 bg-slate-950 px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableAppointments.map((item) => {
                    const status = getApptStatus(item);
                    const badge = statusBadge[status] || statusBadge.cancelled;
                    const joinable = canJoin(item);
                    const cancellable = canCancelScheduledAppointment(item, now);
                    const waitingToJoin = status === "confirmed";
                    return (
                      <tr key={item.id} className="h-14 border-t border-slate-600/40">
                        <td className="px-3 py-3 text-sm font-black text-white">{item.number}</td>
                        <td className="px-3 py-3 text-sm font-bold capitalize text-white">{longDateLabel(item.date)}</td>
                        <td className="px-3 py-3 text-sm font-semibold text-brand-100">{formatLocalSlotRange(item.date, item.time)}</td>
                        <td className="px-3 py-3 text-sm text-slate-300">{item.mode === "vocal" ? "Vocal" : "Vidéo"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wide ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          {joinable ? (
                            <button
                              type="button"
                              onClick={() => joinAppointment(item.id)}
                              className="rounded-xl border-2 border-brand-300 bg-brand-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-brand-300"
                            >
                              Rejoindre
                            </button>
                          ) : cancellable ? (
                            <button
                              type="button"
                              onClick={() => setPendingCancelId(item.id)}
                              className="rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-200"
                            >
                              Annuler
                            </button>
                          ) : waitingToJoin ? (
                            <button
                              type="button"
                              disabled
                              className="cursor-not-allowed rounded-xl border-2 border-slate-300 bg-slate-100 px-3 py-2 text-xs font-black text-slate-400"
                            >
                              Rejoindre
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : appointments.length ? (
            <p className="mt-3 text-sm text-slate-300">
              Aucun rendez-vous ne correspond à ces filtres.
            </p>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-300/40 bg-slate-950/30 px-6 py-9 text-center">
              <img
                src={noAppointmentsGif}
                alt="Aucun rendez-vous"
                className="mb-3 h-28 w-28 object-contain"
                loading="lazy"
              />
              <h3 className="font-display text-lg font-black text-white">Aucun rendez-vous pour le moment</h3>
              <p className="mt-1.5 max-w-sm text-sm text-slate-300">
                Réserve ta première séance avec le coach Hicham 💪 — choisis un{" "}
                <span className="font-black text-brand-200">créneau vert</span> dans le calendrier ci-dessus.
              </p>
            </div>
          )}
        </div>
      </div>

      {pendingSlot && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Confirmer le rendez-vous"
            onClick={() => setPendingSlot(null)}
          >
            <div className="w-[min(100%,30rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <img src={coachHero} alt="Coach Hicham" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <h2 className="font-display text-lg font-black text-slate-900">Confirmer le rendez-vous</h2>
                  <p className="text-xs font-bold text-slate-500">avec Coach Hicham</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-600">
                  Votre créneau est réservé pour le <span className="font-black capitalize text-slate-900">{longDateLabel(pendingSlot.date)}</span> à{" "}
                  <span className="font-black text-slate-900">{formatLocalSlotRange(pendingSlot.date, pendingSlot.time)}</span>, en ligne via un appel{" "}
                  <span className="font-black text-slate-900">{pendingMode === "vocal" ? "vocal" : "vidéo"}</span> selon votre choix.
                </p>
                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">Type d'appel</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingMode("video")}
                      className={`flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-sm font-black transition ${pendingMode === "video" ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m23 7-7 5 7 5V7Z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                      Vidéo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingMode("vocal")}
                      className={`flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-sm font-black transition ${pendingMode === "vocal" ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
                      Vocal
                    </button>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800">
                  Vous pourrez annuler jusqu'au {dayBeforeLabel(pendingSlot.date)} à 23:59. Passé ce délai, le rendez-vous est confirmé.
                </p>
              </div>
              <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
                <button type="button" onClick={() => setPendingSlot(null)} className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-400">
                  Annuler
                </button>
                <button type="button" onClick={confirmBooking} className="flex-1 rounded-2xl border-2 border-brand-300 bg-brand-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-brand-300">
                  Confirmer
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
        : null}

      {pendingCancelId && typeof document !== "undefined"
        ? (() => {
            const appt = appointments.find((a) => a.id === pendingCancelId && !a.cancelled);
            if (!appt) return null;
            const apptCanCancel = canCancelScheduledAppointment(appt, now);
            return createPortal(
              <div
                className="fixed inset-0 z-[97] grid place-items-center p-4"
                style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                role="dialog"
                aria-modal="true"
                aria-label="Confirmer l'annulation"
                onClick={() => setPendingCancelId(null)}
              >
                <div className="w-[min(100%,28rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-black text-slate-900">Annuler le rendez-vous ?</h2>
                      <p className="text-xs font-bold text-slate-500">avec Coach Hicham</p>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-slate-600">
                      {apptCanCancel ? (
                        <>
                          Voulez-vous vraiment annuler votre rendez-vous du{" "}
                          <span className="font-black capitalize text-slate-900">{longDateLabel(appt.date)}</span> à{" "}
                          <span className="font-black text-slate-900">{formatLocalSlotRange(appt.date, appt.time)}</span> ?
                        </>
                      ) : (
                        "Ce rendez-vous est déjà confirmé. L'annulation n'est plus disponible."
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
                    <button type="button" onClick={() => setPendingCancelId(null)} className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-400">
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (canCancelScheduledAppointment(appt, new Date())) {
                          cancelAppointment(pendingCancelId);
                          setPendingCancelId(null);
                        }
                      }}
                      disabled={!apptCanCancel}
                      className="flex-1 rounded-2xl border-2 border-rose-400 bg-rose-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      Confirmer l'annulation
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            );
          })()
        : null}

      {activeCall && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[96] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.88)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Salon de discussion avec Coach Hicham"
          >
            <div className="flex h-[80vh] max-h-[620px] w-[min(100%,40rem)] flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-700 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
                  <h2 className="font-display text-base font-black text-white">
                    Salon — {activeCall.mode === "vocal" ? "Appel vocal" : "Appel vidéo"} avec Coach Hicham
                  </h2>
                </div>
                <button type="button" onClick={() => setActiveCallId(null)} aria-label="Quitter le salon" className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-600 text-slate-300 transition hover:border-rose-400 hover:text-rose-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-950">
                <div className="text-center">
                  <img src={coachHero} alt="Coach Hicham" className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-brand-400/40" />
                  <p className="mt-4 font-display text-xl font-black text-white">Coach Hicham</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {activeCall.mode === "vocal" ? "Appel vocal en cours…" : "Appel vidéo en cours…"} ({formatLocalSlotRange(activeCall.date, activeCall.time)})
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center border-t border-slate-700 bg-slate-900 px-5 py-4">
                <button type="button" onClick={() => setActiveCallId(null)} className="rounded-2xl bg-rose-500 px-6 py-3 text-sm font-black text-white transition hover:bg-rose-600">
                  Quitter le salon
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </section>
  );
}

function MyProgramsPage({ onBack, onGoToShop, refreshSession, onInvoiceSent, onPaidCheckout }) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [purchased, setPurchased] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-purchased");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  });

  // Retour depuis Stripe (paiement lancé depuis « Mes programmes ») : vérification serveur,
  // déblocage, filtre « Acheté » appliqué + toast facture.
  const programsCheckoutRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || programsCheckoutRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const chargily = params.get("chargily");
    const sessionId = params.get("session_id");
    if (!checkout && !chargily) return;
    programsCheckoutRef.current = true;
    const cleanUrl = () => {
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete("checkout");
        u.searchParams.delete("session_id");
        u.searchParams.delete("chargily");
        window.history.replaceState({}, "", u.toString());
      } catch {
        /* ignore */
      }
    };
    // Applique le déblocage à partir du résultat de vérification (Stripe ou Chargily).
    const applyResult = (result) => {
      const ids = Array.isArray(result?.productIds) ? result.productIds : [];
      if (result?.paid && ids.length) {
        setPurchased((current) => {
          const next = Array.from(new Set([...current, ...ids]));
          try {
            window.localStorage.setItem("hm-shop-purchased", JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        });
        setStatusFilter("Acheté");
        {
          const names = ids.map((pid) => coachPrograms.find((p) => p.id === pid)?.name).filter(Boolean).join(", ");
          addShopNotification(
            ids.length > 1
              ? `Vous avez débloqué ${ids.length} programmes (${names}) dans « Mes programmes ».`
              : `Vous avez débloqué le programme « ${names || "—"} » dans « Mes programmes ».`
          );
        }
        if (result.invoiceSent && typeof onInvoiceSent === "function") onInvoiceSent();
      }
    };
    if (checkout === "cancel" || chargily === "cancel") {
      cleanUrl();
      return;
    }
    const token = (typeof window !== "undefined" ? window.sessionStorage.getItem("hm-access-token") : "") || "";
    if (checkout === "success" && sessionId) {
      if (!token) {
        cleanUrl();
        return;
      }
      // Filtre « Acheté » appliqué INSTANTANÉMENT (avant la vérif serveur) pour la rapidité.
      setStatusFilter("Acheté");
      callSupabaseFunctionWithAuth("verify-checkout-session", { sessionId }, token)
        .then(applyResult)
        .catch((error) => console.error("verify-checkout-session (programs) error", error))
        .finally(cleanUrl);
    } else if (chargily === "success") {
      let checkoutId = "";
      try {
        const pending = JSON.parse(window.localStorage.getItem("hm-chargily-pending") || "{}");
        checkoutId = pending?.checkoutId || "";
      } catch { /* ignore */ }
      if (!token || !checkoutId) {
        cleanUrl();
        return;
      }
      setStatusFilter("Acheté");
      callSupabaseFunctionWithAuth("verify-chargily-checkout", { checkoutId }, token)
        .then(applyResult)
        .catch((error) => console.error("verify-chargily-checkout (programs) error", error))
        .finally(() => {
          try { window.localStorage.removeItem("hm-chargily-pending"); } catch { /* ignore */ }
          cleanUrl();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payProgram = async (id) => {
    if (purchased.includes(id)) return;
    const program = coachPrograms.find((entry) => entry.id === id);
    // Programme gratuit : débloqué sans paiement.
    if (program && program.priceType === "Gratuit") {
      const next = Array.from(new Set([...purchased, id]));
      setPurchased(next);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("hm-shop-purchased", JSON.stringify(next));
        } catch {
          /* ignore storage errors */
        }
      }
      addShopNotification(`Vous avez débloqué le programme « ${program.name} » dans « Mes programmes ».`);
      return;
    }
    // Programme payant : paiement RÉEL. En Algérie, choix Stripe / Chargily ; sinon Stripe direct.
    // Au retour, le déblocage est vérifié côté serveur puis appliqué à tout l'app.
    if (typeof onPaidCheckout === "function") {
      onPaidCheckout([id], "programs");
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredPrograms = coachPrograms
    .filter(
      (program) =>
        !normalizedSearch ||
        program.name.toLowerCase().includes(normalizedSearch) ||
        program.number.toLowerCase().includes(normalizedSearch)
    )
    .filter((program) => {
      if (!dateFrom && !dateTo) return true;
      const time = new Date(program.sentDate).getTime();
      if (dateFrom && time < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
      if (dateTo && time > new Date(`${dateTo}T23:59:59`).getTime()) return false;
      return true;
    })
    .filter((program) => {
      if (statusFilter === "all") return true;
      const isPurchased = purchased.includes(program.id);
      if (statusFilter === "Gratuit") return program.priceType === "Gratuit";
      if (statusFilter === "Payant") return program.priceType === "Payant" && !isPurchased;
      if (statusFilter === "Acheté") return program.priceType === "Payant" && isPurchased;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const da = new Date(a.sentDate).getTime();
      const db = new Date(b.sentDate).getTime();
      return sortDesc ? db - da : da - db;
    });

  const formatSentDate = (value) =>
    new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const cartCount = (() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = window.localStorage.getItem("hm-shop-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="settings-hero shrink-0">
        <div className="settings-hero__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
            <path d="M6 4h9a3 3 0 0 1 3 3v13H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M6 16h12M9 8h6M9 12h4" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="settings-hero__title">Mes programmes</h1>
          <p className="settings-hero__subtitle">Retrouvez ici tous les programmes envoyés par votre coach Hicham.</p>
        </div>
        <div className="settings-hero__actions" aria-label="Actions rapides">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="settings-hero__back"
              aria-label="Revenir en arrière"
              title="Revenir en arrière"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
                <path d="M9 12h11" />
              </svg>
              <span>Retour</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onGoToShop}
            className="settings-hero__action"
            aria-label="Panier"
            title="Voir le panier (boutique)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          <CoachInbox />
        </div>
      </div>

      <div className="settings-scroll mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        <div className="settings-card">
          <SettingsSectionHeader
            icon="shop"
            eyebrow="Programmes"
            title="Recherche & filtres"
            action={<span className="settings-chip">{filteredPrograms.length} programme{filteredPrograms.length > 1 ? "s" : ""}</span>}
          />

          <label className="mt-4 block text-xs font-semibold text-slate-300">
            <span>Rechercher un programme</span>
            <div className="relative mt-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un programme..."
                className="mt-0 w-full rounded-2xl border border-brand-300/45 bg-slate-950/45 px-4 py-3 pl-12 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-300 focus:bg-slate-950/70 focus:ring-4 focus:ring-brand-300/10"
              />
            </div>
          </label>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-xs font-semibold text-slate-300">
              <span>Date début</span>
              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(event) => setDateFrom(event.target.value)}
                className="mt-1 block rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300"
              />
            </label>
            <label className="text-xs font-semibold text-slate-300">
              <span>Date fin</span>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(event) => setDateTo(event.target.value)}
                className="mt-1 block rounded-xl border border-slate-600/65 bg-slate-950/45 px-3 py-2 text-sm font-bold text-white outline-none focus:border-brand-300"
              />
            </label>
            <div className="text-xs font-semibold text-slate-300">
              <span>Trier par date</span>
              <div className="mt-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => setSortDesc(true)}
                  className={`rounded-xl px-3 py-2 text-xs font-black transition ${sortDesc
                      ? "border-2 border-brand-300 bg-brand-400 text-slate-950"
                      : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                    }`}
                >
                  Plus récent
                </button>
                <button
                  type="button"
                  onClick={() => setSortDesc(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-black transition ${!sortDesc
                      ? "border-2 border-brand-300 bg-brand-400 text-slate-950"
                      : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                    }`}
                >
                  Plus ancien
                </button>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-300">
              <span>Type</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {[["all", "Tous"], ["Gratuit", "Gratuit"], ["Payant", "Payant"], ["Acheté", "Acheté"]].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-xl px-3 py-2 text-xs font-black transition ${statusFilter === value
                        ? "border-2 border-brand-300 bg-brand-400 text-slate-950"
                        : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {dateFrom || dateTo ? (
              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="rounded-xl border border-slate-600/65 bg-slate-950/35 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-brand-300/70 hover:text-brand-100"
              >
                Effacer les dates
              </button>
            ) : null}
          </div>
        </div>

        <div className="settings-card mt-2 flex flex-1 flex-col">
          <SettingsSectionHeader icon="shop" eyebrow="Liste" title="Programmes reçus" />
          {coachPrograms.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-600/60 bg-slate-950/35 px-4 py-10 text-center">
              <p className="font-display text-lg font-black text-white">Aucun programme disponible pour le moment.</p>
              <p className="mt-2 text-sm text-slate-400">Votre coach Hicham vous enverra un programme prochainement.</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-950/35 px-4 py-10 text-center">
              <p className="font-display text-lg font-black text-white">Aucun programme ne correspond</p>
              <p className="mt-2 text-sm text-slate-400">Essaie une autre recherche ou modifie les dates.</p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700/70 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
                    <th className="px-3 py-2">N°</th>
                    <th className="px-3 py-2">Nom du programme</th>
                    <th className="px-3 py-2">Date d'envoi</th>
                    <th className="px-3 py-2">Remarque du coach</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => {
                    const unlocked = program.priceType === "Gratuit" || purchased.includes(program.id);
                    const actionClass = unlocked
                      ? "border border-brand-300/55 bg-brand-400/12 text-brand-100 transition hover:bg-brand-400 hover:text-slate-950"
                      : "cursor-not-allowed border border-slate-700/60 bg-slate-950/30 text-slate-500 opacity-60";
                    return (
                      <tr key={program.id} className="border-b border-slate-800/70 align-top">
                        <td className="px-3 py-3 font-black text-white">{program.number}</td>
                        <td className="px-3 py-3">
                          <div className="font-black text-white">{program.name}</div>
                          <span
                            className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${program.priceType === "Gratuit"
                                ? "border border-brand-300/45 bg-brand-400/15 text-brand-100"
                                : unlocked
                                  ? "border border-sky-400/50 bg-sky-500/15 text-sky-300"
                                  : "border border-orange-400 bg-orange-500/15 text-orange-400"
                              }`}
                          >
                            {program.priceType === "Gratuit" ? "Gratuit" : unlocked ? "Acheté" : "Payant"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-300">{formatSentDate(program.sentDate)}</td>
                        <td className="px-3 py-3 text-slate-300">{program.remark}</td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-1.5">
                            {unlocked ? (
                              <>
                                <button
                                  type="button"
                                  title="Consulter"
                                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black ${actionClass}`}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  Consulter
                                </button>
                                <button
                                  type="button"
                                  title="Télécharger"
                                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black ${actionClass}`}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <path d="M7 10l5 5 5-5" />
                                    <path d="M12 15V3" />
                                  </svg>
                                  Télécharger
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => payProgram(program.id)}
                                title="Payer ce programme"
                                className="flex items-center gap-1.5 rounded-xl border-2 border-brand-300 bg-brand-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-brand-300"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                  <rect x="2" y="5" width="20" height="14" rx="2" />
                                  <path d="M2 10h20" />
                                </svg>
                                Payer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ShopPage({
  searchValue,
  onSearchChange,
  category,
  onCategoryChange,
  priceType,
  onPriceTypeChange,
  onBack,
  customerName,
  customerEmail,
  accessToken,
  refreshSession,
  onInvoiceSent,
  onPaidCheckout,
  isAlgeria,
}) {
  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredProducts = shopProducts.filter((product) => {
    const matchesCategory = category === "Tous" || product.category === category;
    const matchesPrice = priceType === "Tous" || product.priceType === priceType;
    const haystack = [product.title, product.category, product.priceType, product.description, ...product.tags]
      .join(" ")
      .toLowerCase();

    return matchesCategory && matchesPrice && (!normalizedSearch || haystack.includes(normalizedSearch));
  });

  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-favorites");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (productId) => {
    setFavorites((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("hm-shop-favorites", JSON.stringify(next));
        } catch {
          /* ignore storage errors */
        }
      }
      return next;
    });
  };

  const [view, setView] = useState("all");
  const [favPurchasedOnly, setFavPurchasedOnly] = useState(false);
  const [purchased, setPurchased] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-purchased");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  });

  const persistPurchased = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-shop-purchased", JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
    }
    return next;
  };

  const displayedProducts =
    view === "favorites"
      ? filteredProducts.filter(
          (product) =>
            favorites.includes(product.id) && (!favPurchasedOnly || purchased.includes(product.id))
        )
      : view === "purchased"
        ? filteredProducts.filter((product) => purchased.includes(product.id))
        : filteredProducts.filter((product) => !purchased.includes(product.id));

  const pageSize = 3;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pagedProducts = displayedProducts.slice(safePage * pageSize, safePage * pageSize + pageSize);

  useEffect(() => {
    setPage(0);
  }, [category, priceType, normalizedSearch, view, favPurchasedOnly]);

  const priceCountBase = (
    view === "favorites"
      ? shopProducts.filter((product) => favorites.includes(product.id))
      : view === "purchased"
        ? shopProducts.filter((product) => purchased.includes(product.id))
        : shopProducts.filter((product) => !purchased.includes(product.id))
  ).filter((product) => {
    const matchesCategory = category === "Tous" || product.category === category;
    const haystack = [product.title, product.category, product.priceType, product.description, ...product.tags]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalizedSearch || haystack.includes(normalizedSearch));
  });

  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((entry) => (typeof entry === "string" ? entry : entry?.id)).filter(Boolean);
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const persistCart = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-shop-cart", JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
    }
    return next;
  };

  const addToCart = (productId) => {
    setCheckoutMessage("");
    setCart((current) => (current.includes(productId) ? current : persistCart([...current, productId])));
  };

  const removeFromCart = (productId) => {
    setCart((current) => persistCart(current.filter((id) => id !== productId)));
  };

  const cartItems = cart
    .map((id) => {
      const product = shopProducts.find((entry) => entry.id === id);
      return product ? { ...product, priceValue: parseProductPrice(product.price) } : null;
    })
    .filter(Boolean);
  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.priceValue || 0), 0);
  const hasQuoteItems = cartItems.some((item) => item.priceValue == null);

  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("hm-shop-notifications");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [notifFilter, setNotifFilter] = useState("all");
  const [notifSortDesc, setNotifSortDesc] = useState(true);
  const [notifFrom, setNotifFrom] = useState("");
  const [notifTo, setNotifTo] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const welcome = {
      id: "coach-welcome",
      from: "coach",
      type: "text",
      text: "Bonjour 👋 Pose-moi ta question, je te réponds dès que possible !",
      date: new Date().toISOString(),
      reactions: []
    };
    if (typeof window === "undefined") return [welcome];
    try {
      const saved = window.localStorage.getItem("hm-coach-chat");
      const parsed = saved ? JSON.parse(saved) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.some((message) => message && message.id === "coach-welcome") ? list : [welcome, ...list];
    } catch {
      return [welcome];
    }
  });
  const [lastChatReadAt, setLastChatReadAt] = useState(() => {
    if (typeof window === "undefined") return 0;
    const v = Number(window.localStorage.getItem("hm-coach-chat-read") || 0);
    return Number.isFinite(v) ? v : 0;
  });
  const hasUnreadCoach = chatMessages.some(
    (m) => m && m.from === "coach" && m.id !== "coach-welcome" && new Date(m.date).getTime() > lastChatReadAt
  );
  const markChatRead = () => {
    const t = Date.now();
    setLastChatReadAt(t);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-coach-chat-read", String(t));
      } catch {
        /* ignore */
      }
    }
  };
  const openChat = () => {
    markChatRead();
    setIsChatOpen(true);
  };
  const mediaRecorderRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const chatImageInputRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [reactionPickerId, setReactionPickerId] = useState(null);
  const [coachOnline, setCoachOnline] = useState(false);

  useEffect(() => {
    const computeCoachOnline = () => {
      const hour = new Date().getHours();
      setCoachOnline(hour >= 8 && hour < 22);
    };
    computeCoachOnline();
    const interval = setInterval(computeCoachOnline, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const reloadNotifications = () => {
      try {
        const saved = window.localStorage.getItem("hm-shop-notifications");
        const parsed = saved ? JSON.parse(saved) : [];
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } catch {
        /* ignore storage errors */
      }
    };
    window.addEventListener("hm-notifications-changed", reloadNotifications);
    window.addEventListener("storage", reloadNotifications);
    return () => {
      window.removeEventListener("hm-notifications-changed", reloadNotifications);
      window.removeEventListener("storage", reloadNotifications);
    };
  }, []);

  const persistNotifications = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-shop-notifications", JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
    }
    return next;
  };

  const addNotification = (text) => {
    setNotifications((current) =>
      persistNotifications([
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, date: new Date().toISOString(), read: false },
        ...current
      ])
    );
  };

  const openNotifications = () => {
    setIsNotifOpen(true);
  };

  const clearNotifications = () => {
    setNotifications(persistNotifications([]));
    setSelectedNotifs([]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => persistNotifications(current.map((item) => ({ ...item, read: true }))));
  };

  const toggleNotificationRead = (id) => {
    setNotifications((current) =>
      persistNotifications(current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
    );
  };

  const toggleSelectNotif = (id) => {
    setSelectedNotifs((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  };

  const deleteSelectedNotifs = () => {
    setNotifications((current) => persistNotifications(current.filter((item) => !selectedNotifs.includes(item.id))));
    setSelectedNotifs([]);
  };

  const markSelectedNotifsRead = () => {
    setNotifications((current) =>
      persistNotifications(current.map((item) => (selectedNotifs.includes(item.id) ? { ...item, read: true } : item)))
    );
    setSelectedNotifs([]);
  };

  const deleteNotification = (id) => {
    setNotifications((current) => persistNotifications(current.filter((item) => item.id !== id)));
    setSelectedNotifs((current) => current.filter((entry) => entry !== id));
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const visibleNotifications = notifications
    .filter((item) => notifFilter === "all" || (notifFilter === "unread" ? !item.read : item.read))
    .filter((item) => {
      if (!notifFrom && !notifTo) return true;
      const time = new Date(item.date).getTime();
      if (notifFrom && time < new Date(`${notifFrom}T00:00:00`).getTime()) return false;
      if (notifTo && time > new Date(`${notifTo}T23:59:59`).getTime()) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return notifSortDesc ? db - da : da - db;
    });

  const allVisibleNotifsSelected =
    visibleNotifications.length > 0 && visibleNotifications.every((item) => selectedNotifs.includes(item.id));

  const toggleSelectAllVisibleNotifs = () => {
    if (allVisibleNotifsSelected) {
      setSelectedNotifs([]);
    } else {
      setSelectedNotifs(visibleNotifications.map((item) => item.id));
    }
  };

  const persistChat = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hm-coach-chat", JSON.stringify(next));
      } catch {
        /* ignore storage errors (quota) */
      }
    }
    return next;
  };

  const pushChatMessage = (message) => {
    const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setChatMessages((current) =>
      persistChat([
        ...current,
        { id: localId, date: new Date().toISOString(), from: "user", ...message }
      ])
    );
    if (!__hmIsCoach) {
      const kind = message.type === "image" ? "image" : message.type === "voice" ? "voice" : message.type === "file" ? "file" : "text";
      (async () => {
        const token = await getHmToken();
        if (!token) return;
        let body;
        if (kind === "text") {
          body = String(message.text || "").trim();
        } else if (message.dataUrl) {
          const url = await uploadChatMedia(token, message.dataUrl, kind, message.fileName);
          body = url || (kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim());
        } else {
          body = kind === "image" ? "[Image]" : kind === "voice" ? "[Message vocal]" : `[Fichier] ${message.fileName || ""}`.trim();
        }
        if (body) { try { await sendBackendMessage({ accessToken: token, body, kind }); } catch { /* ignore */ } }
      })();
    }
  };

  const sendChatText = () => {
    const text = chatText.trim();
    if (!text) return;
    pushChatMessage({ type: "text", text });
    setChatText("");
  };

  const handleChatFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith("image/");
      pushChatMessage({ type: isImage ? "image" : "file", dataUrl: String(reader.result), fileName: file.name });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const startChatRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || typeof MediaRecorder === "undefined") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => pushChatMessage({ type: "voice", dataUrl: String(reader.result) });
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopChatRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const deleteChatMessage = (id) => {
    setChatMessages((current) => persistChat(current.filter((message) => message.id !== id)));
  };

  const startEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingText(message.text || "");
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const saveEditMessage = () => {
    const text = editingText.trim();
    if (!text) return;
    setChatMessages((current) =>
      persistChat(current.map((message) => (message.id === editingMessageId ? { ...message, text, edited: true } : message)))
    );
    setEditingMessageId(null);
    setEditingText("");
  };

  const toggleChatReaction = (id, emoji) => {
    setChatMessages((current) =>
      persistChat(
        current.map((message) => {
          if (message.id !== id) return message;
          const reactions = Array.isArray(message.reactions) ? message.reactions : [];
          // Un seul emoji à la fois : remplace la réaction existante ou la supprime si c'est la même
          return {
            ...message,
            reactions: reactions.includes(emoji) ? [] : [emoji]
          };
        })
      )
    );
    setReactionPickerId(null);
  };

  // Retour depuis Stripe : on vérifie le paiement CÔTÉ SERVEUR avant de débloquer quoi que ce soit.
  const checkoutHandledRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || checkoutHandledRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const chargily = params.get("chargily");
    const sessionId = params.get("session_id");
    if (!checkout && !chargily) return;
    checkoutHandledRef.current = true;

    const cleanCheckoutUrl = () => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("checkout");
        url.searchParams.delete("session_id");
        url.searchParams.delete("chargily");
        window.history.replaceState({}, "", url.toString());
      } catch {
        /* ignore */
      }
    };

    // Applique le déblocage à partir du résultat de vérification (Stripe ou Chargily).
    const applyResult = (result) => {
      const ids = Array.isArray(result?.productIds) ? result.productIds : [];
      if (result?.paid && ids.length) {
        setPurchased((current) => persistPurchased(Array.from(new Set([...current, ...ids]))));
        setCart(persistCart([]));
        setView("purchased");
        const titles = ids
          .map((id) => shopProducts.find((product) => product.id === id)?.title)
          .filter(Boolean)
          .join(", ");
        const invoiceNote = result.invoiceSent
          ? " La facture Hicham Fit App a été envoyée à ton adresse email."
          : "";
        addNotification(
          ids.length > 1
            ? `Vous avez débloqué ${ids.length} programmes (${titles}) dans la boutique.${invoiceNote}`
            : `Vous avez débloqué le programme « ${titles} » dans la boutique.${invoiceNote}`
        );
        setCheckoutMessage("Paiement confirmé ✓ Tes programmes sont débloqués dans « Mes programmes »." + (invoiceNote ? ` ${invoiceNote.trim()}` : ""));
        if (result.invoiceSent && typeof onInvoiceSent === "function") {
          onInvoiceSent();
        }
      } else {
        setCheckoutMessage("Le paiement n'a pas été confirmé. Si tu as été débité, contacte le support.");
      }
    };

    if (checkout === "cancel" || chargily === "cancel") {
      setCheckoutMessage("Paiement annulé. Ton panier a été conservé.");
      setIsCartOpen(true);
      cleanCheckoutUrl();
      return;
    }

    const token =
      accessToken ||
      (typeof window !== "undefined" ? window.sessionStorage.getItem("hm-access-token") : "") ||
      "";

    if (checkout === "success" && sessionId) {
      if (!token) {
        setCheckoutMessage("Paiement effectué, mais session expirée : reconnecte-toi pour débloquer tes achats.");
        cleanCheckoutUrl();
        return;
      }
      // Redirection INSTANTANÉE vers « Achetés » (avant même la vérif serveur) pour la rapidité.
      setView("purchased");
      setCheckoutMessage("Vérification du paiement…");
      callSupabaseFunctionWithAuth("verify-checkout-session", { sessionId }, token)
        .then(applyResult)
        .catch((error) => {
          console.error("verify-checkout-session error", error);
          setCheckoutMessage(`Vérification du paiement échouée : ${error?.message || error?.code || "erreur inconnue"}`);
        })
        .finally(() => {
          cleanCheckoutUrl();
        });
    } else if (chargily === "success") {
      let checkoutId = "";
      try {
        const pending = JSON.parse(window.localStorage.getItem("hm-chargily-pending") || "{}");
        checkoutId = pending?.checkoutId || "";
      } catch { /* ignore */ }
      if (!token || !checkoutId) {
        setCheckoutMessage("Paiement effectué, mais session expirée : reconnecte-toi pour débloquer tes achats.");
        cleanCheckoutUrl();
        return;
      }
      // Redirection INSTANTANÉE vers « Achetés » pour la rapidité.
      setView("purchased");
      setCheckoutMessage("Vérification du paiement…");
      callSupabaseFunctionWithAuth("verify-chargily-checkout", { checkoutId }, token)
        .then(applyResult)
        .catch((error) => {
          console.error("verify-chargily-checkout error", error);
          setCheckoutMessage(`Vérification du paiement échouée : ${error?.message || error?.code || "erreur inconnue"}`);
        })
        .finally(() => {
          try { window.localStorage.removeItem("hm-chargily-pending"); } catch { /* ignore */ }
          cleanCheckoutUrl();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    // Produits gratuits : débloqués sans paiement. Produits payants : paiement réel via Stripe.
    const freeIds = cartItems
      .filter((item) => item.priceValue == null || item.priceValue <= 0)
      .map((item) => item.id);
    const paidIds = cartItems
      .filter((item) => item.priceValue != null && item.priceValue > 0)
      .map((item) => item.id);

    if (freeIds.length) {
      setPurchased((current) => persistPurchased(Array.from(new Set([...current, ...freeIds]))));
    }

    if (!paidIds.length) {
      setCart(persistCart([]));
      setCheckoutMessage("Produits gratuits débloqués. Retrouvez-les dans « Mes programmes ».");
      return;
    }

    // Paiement RÉEL. En Algérie, on ouvre le choix Stripe / Chargily (CCP) ; sinon Stripe direct.
    setCheckoutMessage("Redirection vers le paiement sécurisé…");
    if (typeof onPaidCheckout === "function") {
      onPaidCheckout(paidIds, "shop");
    }
  };

  const [detailProduct, setDetailProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openDetail = (product) => {
    setActiveImageIndex(0);
    setDetailProduct(product);
  };
  const closeDetail = () => setDetailProduct(null);

  const detailImages = detailProduct && Array.isArray(detailProduct.images) ? detailProduct.images : [];
  const detailImageIndex = detailImages.length ? Math.min(activeImageIndex, detailImages.length - 1) : 0;
  const detailActiveImage = detailImages.length ? detailImages[detailImageIndex] : null;
  const detailCanAccess = detailProduct
    ? detailProduct.priceType === "Gratuit" || purchased.includes(detailProduct.id)
    : false;
  const detailInCart = detailProduct ? cart.includes(detailProduct.id) : false;

  return (
    <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="settings-hero shrink-0">
        <div className="settings-hero__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
            <path d="M3 6h18l-1.5 11A2 2 0 0 1 17.5 19h-11a2 2 0 0 1-2-1.99L3 6Z" />
            <path d="M8 6V4a4 4 0 0 1 8 0v2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="settings-hero__title">Boutique Hicham</h1>
          <p className="settings-hero__subtitle">
            Découvrez les programmes, guides et ressources proposés par coach hicham pour améliorer votre progression sportive.
          </p>
        </div>
        <div className="settings-hero__actions" aria-label="Actions rapides">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="settings-hero__back"
              aria-label="Revenir en arrière"
              title="Revenir en arrière"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18 9 12l6-6" />
                <path d="M9 12h11" />
              </svg>
              <span>Retour</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="settings-hero__action"
            aria-label="Panier"
            title="Panier"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-400 px-1 text-[10px] font-black text-slate-950">
                {cartCount}
              </span>
            ) : null}
          </button>
          <button type="button" onClick={openNotifications} className="settings-hero__action" aria-label="Notifications" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          <button type="button" onClick={openChat} className="settings-hero__action relative" aria-label="Messagerie" title="Messagerie">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
              <path d="M8 9h8M8 13h5" />
            </svg>
            {hasUnreadCoach ? (
              <span className="absolute right-1 top-1 flex h-2.5 w-2.5" aria-label="Nouveau message">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" />
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="settings-scroll mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        <div className="settings-card">
          <SettingsSectionHeader
            icon="shop"
            eyebrow="Boutique"
            title="Recherche produit"
            action={<span className="settings-chip">Catalogue</span>}
          />

          <label className="mt-4 block text-xs font-semibold text-slate-300">
            <span>Rechercher un produit</span>
            <div className="relative mt-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Rechercher un programme, un livre ou un guide..."
                className="mt-0 w-full rounded-2xl border border-brand-300/45 bg-slate-950/45 px-4 py-3 pl-12 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-300 focus:bg-slate-950/70 focus:ring-4 focus:ring-brand-300/10"
              />
            </div>
          </label>

        </div>

        <div className="mt-2 grid gap-2 xl:min-h-0 xl:flex-1 xl:auto-rows-fr xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col">
            <article className="settings-card flex flex-1 flex-col">
              <SettingsSectionHeader
                icon="shop"
                eyebrow="Produits"
                title={view === "favorites" ? "Mes favoris" : view === "purchased" ? "Mes achats" : "Catalogue"}
                action={<span className="settings-chip">{displayedProducts.length} résultat{displayedProducts.length > 1 ? "s" : ""}</span>}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setView("all")}
                  aria-pressed={view === "all"}
                  className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition ${view === "all"
                      ? "border-2 border-brand-300 text-brand-300"
                      : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Tous les produits
                </button>
                <button
                  type="button"
                  onClick={() => setView("favorites")}
                  aria-pressed={view === "favorites"}
                  className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition ${view === "favorites"
                      ? "border-2 border-rose-500 text-rose-500"
                      : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-rose-400/60 hover:text-rose-200"
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                  Mes favoris
                </button>
                <button
                  type="button"
                  onClick={() => setView("purchased")}
                  aria-pressed={view === "purchased"}
                  className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition ${view === "purchased"
                      ? "border-2 border-sky-400 text-sky-400"
                      : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-sky-400/60 hover:text-sky-200"
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                  Mes achats
                </button>
              </div>
              {displayedProducts.length ? (
                <>
                <div className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedProducts.map((product) => {
                    const isFavorite = favorites.includes(product.id);
                    const inCart = cart.includes(product.id);
                    const isPurchased = purchased.includes(product.id);
                    return (
                    <article
                      key={product.id}
                      className="flex h-full min-h-[220px] flex-col rounded-2xl border border-slate-700/70 bg-slate-950/38 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.18)] transition hover:border-brand-300/55 hover:bg-slate-950/52"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-xl border border-brand-300/35 bg-brand-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-100">
                          {product.badge}
                        </span>
                        <div className="flex items-center gap-2">
                          {view === "purchased" ? null : isPurchased ? (
                            <span className="rounded-xl border border-sky-400/50 bg-sky-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-sky-300">
                              Acheté
                            </span>
                          ) : (
                            <span
                              className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${product.priceType === "Gratuit"
                                  ? "border border-brand-300/45 bg-brand-400/15 text-brand-100"
                                  : "border border-orange-400 bg-orange-500/15 text-orange-400"
                                }`}
                            >
                              {product.priceType}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.id)}
                            aria-pressed={isFavorite}
                            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${isFavorite
                                ? "border-rose-400/70 bg-rose-500/15 text-rose-400"
                                : "border-slate-600/65 bg-slate-950/35 text-slate-400 hover:border-rose-400/60 hover:text-rose-300"
                              }`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill={isFavorite ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-black leading-tight text-white">{product.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{product.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-2 py-1 text-[10px] font-bold text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                        {product.priceType === "Gratuit" || isPurchased ? (
                          <span />
                        ) : (
                          <span className="text-sm font-black text-white">{formatRegionalPrice(parseProductPrice(product.price), isAlgeria)}</span>
                        )}
                        <div className="flex items-center gap-2">
                          {product.priceType === "Payant" && !isPurchased ? (
                            <button
                              type="button"
                              onClick={() => addToCart(product.id)}
                              disabled={inCart}
                              aria-label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
                              title={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${inCart
                                  ? "cursor-default border-brand-300/40 bg-brand-400/15 text-brand-200"
                                  : "border-brand-300/55 bg-brand-400/12 text-brand-100 hover:bg-brand-400 hover:text-slate-950"
                                }`}
                            >
                              {inCart ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                  <circle cx="9" cy="21" r="1" />
                                  <circle cx="20" cy="21" r="1" />
                                  <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                                </svg>
                              )}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => openDetail(product)}
                            className="rounded-xl border border-brand-300/55 bg-brand-400/12 px-3 py-2 text-xs font-black text-brand-100 transition hover:bg-brand-400 hover:text-slate-950"
                          >
                            Voir le détail
                          </button>
                        </div>
                      </div>
                    </article>
                    );
                  })}
                </div>
                {totalPages > 1 ? (
                  <div className="mt-auto flex items-center justify-center gap-2 pt-5">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPage(index)}
                        aria-label={`Page ${index + 1}`}
                        aria-current={index === safePage}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition ${index === safePage
                            ? "border-2 border-brand-300 bg-brand-400 text-slate-950 shadow-[0_8px_18px_rgba(34,197,94,0.28)]"
                            : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                ) : null}
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-950/35 px-4 py-8 text-center">
                  {view === "favorites" && favorites.length === 0 ? (
                    <>
                      <p className="font-display text-lg font-black text-white">Aucun favori pour l'instant</p>
                      <p className="mt-2 text-sm text-slate-400">Clique sur le cœur d'un programme pour l'ajouter à tes favoris.</p>
                    </>
                  ) : view === "favorites" ? (
                    <>
                      <p className="font-display text-lg font-black text-white">Aucun favori ne correspond</p>
                      <p className="mt-2 text-sm text-slate-400">Essaie une autre recherche ou change les filtres.</p>
                    </>
                  ) : view === "purchased" && purchased.length === 0 ? (
                    <>
                      <p className="font-display text-lg font-black text-white">Aucun programme acheté</p>
                      <p className="mt-2 text-sm text-slate-400">Vos programmes achetés apparaîtront ici après le paiement.</p>
                    </>
                  ) : view === "purchased" ? (
                    <>
                      <p className="font-display text-lg font-black text-white">Aucun achat ne correspond</p>
                      <p className="mt-2 text-sm text-slate-400">Essaie une autre recherche ou change les filtres.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg font-black text-white">Aucun produit trouvé</p>
                      <p className="mt-2 text-sm text-slate-400">Essaie une autre recherche ou change les filtres.</p>
                    </>
                  )}
                </div>
              )}
            </article>
          </div>

          <aside className="flex flex-col gap-2">
            {view === "purchased" ? null : (
            <article className="settings-card">
              <SettingsSectionHeader
                icon="security"
                eyebrow="Filtre"
                title="Type / prix"
                action={<span className="settings-chip">{priceType}</span>}
              />
              <div className="mt-4 grid gap-2">
                {shopPriceTypeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onPriceTypeChange(option);
                      setFavPurchasedOnly(false);
                    }}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-left text-sm font-black transition ${priceType === option && !favPurchasedOnly
                        ? "border-2 border-brand-300 bg-brand-400 text-slate-950 shadow-[0_12px_26px_rgba(34,197,94,0.28)] outline outline-2 outline-brand-100/90 ring-4 ring-brand-300/25"
                        : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                      }`}
                  >
                    <span>{option}</span>
                    <span className="text-xs opacity-75">
                      {priceCountBase.filter((product) => option === "Tous" || product.priceType === option).length}
                    </span>
                  </button>
                ))}
                {view === "favorites" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !favPurchasedOnly;
                      setFavPurchasedOnly(next);
                      if (next) onPriceTypeChange("Tous");
                    }}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-left text-sm font-black transition ${favPurchasedOnly
                        ? "border-2 border-brand-300 bg-brand-400 text-slate-950 shadow-[0_12px_26px_rgba(34,197,94,0.28)] outline outline-2 outline-brand-100/90 ring-4 ring-brand-300/25"
                        : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                      }`}
                  >
                    <span>Achetés</span>
                    <span className="text-xs opacity-75">{favorites.filter((id) => purchased.includes(id)).length}</span>
                  </button>
                ) : null}
              </div>
            </article>
            )}

            <article className="settings-card flex-1">
              <SettingsSectionHeader
                icon="shop"
                eyebrow="Filtre"
                title="Catégorie"
                action={<span className="settings-chip">{category}</span>}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {shopCategoryOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onCategoryChange(option)}
                    className={`rounded-2xl px-3.5 py-2 text-xs font-black transition ${category === option
                        ? "border-2 border-brand-300 bg-brand-400 text-slate-950 shadow-[0_12px_26px_rgba(34,197,94,0.28)] outline outline-2 outline-brand-100/90 ring-4 ring-brand-300/25"
                        : "border border-slate-600/65 bg-slate-950/35 text-slate-200 hover:border-brand-300/70 hover:text-brand-100"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </div>

      {isCartOpen && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[90] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            onClick={() => setIsCartOpen(false)}
          >
            <div
              className="flex max-h-[85vh] w-[min(100%,32rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-500" aria-hidden="true">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                  <h2 className="font-display text-lg font-black text-slate-900">Mon panier</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Fermer le panier"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {checkoutMessage ? (
                  <div className="mb-4 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
                    {checkoutMessage}
                  </div>
                ) : null}
                {cartItems.length ? (
                  <ul className="space-y-3">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.badge}</p>
                        </div>
                        <span className="shrink-0 text-sm font-black text-slate-900">
                          {item.priceValue != null ? formatRegionalPrice(item.priceValue, isAlgeria) : "Sur demande"}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Retirer du panier"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-400 transition hover:border-rose-400 hover:text-rose-500"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-display text-lg font-black text-slate-900">Votre panier est vide</p>
                    <p className="mt-2 text-sm text-slate-500">Ajoutez des programmes payants pour les régler en une seule fois.</p>
                  </div>
                )}
              </div>

              {cartItems.length ? (
                <div className="shrink-0 border-t border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">Total</span>
                    <span className="font-display text-2xl font-black text-slate-900">{formatRegionalPrice(cartTotal, isAlgeria)}</span>
                  </div>
                  {hasQuoteItems ? (
                    <p className="mt-1 text-xs text-orange-600">
                      Certains articles « Sur demande » seront facturés séparément.
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="mt-3 w-full rounded-2xl border-2 border-brand-300 bg-brand-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-brand-300"
                  >
                    Payer {formatRegionalPrice(cartTotal, isAlgeria)}
                  </button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
        : null}

      {detailProduct && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label={detailProduct.title}
            onClick={closeDetail}
          >
            <div
              className="flex max-h-[88vh] w-[min(100%,40rem)] flex-col overflow-hidden rounded-3xl border border-brand-300/35 bg-slate-950/95 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="min-w-0">
                  <span className="inline-block rounded-xl border border-brand-300/35 bg-brand-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-100">
                    {detailProduct.badge}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-black leading-tight text-white">{detailProduct.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  aria-label="Fermer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-600/65 bg-slate-950/40 text-slate-300 transition hover:border-brand-300/70 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {detailImages.length ? (
                  <div>
                    <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/40">
                      <img src={detailActiveImage} alt={detailProduct.title} className="mx-auto max-h-72 w-full object-contain" />
                    </div>
                    {detailImages.length > 1 ? (
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {detailImages.map((image, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            aria-label={`Photo ${index + 1}`}
                            aria-current={index === detailImageIndex}
                            className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${index === detailImageIndex
                                ? "border-brand-300"
                                : "border-slate-700/70 opacity-70 hover:opacity-100"
                              }`}
                          >
                            <img src={image} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-600/60 bg-slate-950/40 px-4 py-8 text-center">
                    <p className="text-sm font-bold text-slate-300">Aucune photo ajoutée pour ce programme.</p>
                    <p className="mt-1 text-xs text-slate-500">Le coach pourra ajouter une ou plusieurs photos ici.</p>
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {detailProduct.longDescription || detailProduct.description}
                </p>

                {detailProduct.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {detailProduct.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-2 py-1 text-[10px] font-bold text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 border-t border-white/10 px-5 py-4">
                {detailProduct.priceType === "Gratuit" || purchased.includes(detailProduct.id) ? null : (
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">Prix</span>
                    <span className="font-display text-xl font-black text-white">{detailProduct.priceType === "Gratuit" ? detailProduct.price : formatRegionalPrice(parseProductPrice(detailProduct.price), isAlgeria)}</span>
                  </div>
                )}
                {detailCanAccess ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-brand-300/55 bg-brand-400/12 px-4 py-2.5 text-sm font-black text-brand-100 transition hover:bg-brand-400 hover:text-slate-950"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Consulter
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-brand-300 bg-brand-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-brand-300"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="M7 10l5 5 5-5" />
                        <path d="M12 15V3" />
                      </svg>
                      Télécharger
                    </button>
                  </div>
                ) : detailInCart ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-default rounded-2xl border border-brand-300/40 bg-brand-400/15 px-4 py-3 text-sm font-black text-brand-200"
                  >
                    Déjà dans le panier
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(detailProduct.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-300 bg-brand-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-brand-300"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                    </svg>
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
        : null}

      {isNotifOpen && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            onClick={() => setIsNotifOpen(false)}
          >
            <div
              className="flex max-h-[85vh] w-[min(100%,34rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-500" aria-hidden="true">
                    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </svg>
                  <h2 className="font-display text-lg font-black text-slate-900">Notifications</h2>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">{unreadCount}</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(false)}
                  aria-label="Fermer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {notifications.length ? (
                <div className="shrink-0 border-b border-slate-200 px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[["all", "Tous"], ["unread", "Non lus"], ["read", "Lus"]].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNotifFilter(value)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${notifFilter === value
                              ? "bg-brand-400 text-slate-950"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      disabled={unreadCount === 0}
                      className="ml-auto rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tout lu
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNotifSortDesc(true)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${notifSortDesc
                          ? "bg-brand-400 text-slate-950"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      Plus récents
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifSortDesc(false)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${!notifSortDesc
                          ? "bg-brand-400 text-slate-950"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      Plus anciens
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Du</span>
                    <input
                      type="date"
                      value={notifFrom}
                      max={notifTo || undefined}
                      onChange={(event) => setNotifFrom(event.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-400"
                    />
                    <span className="text-xs font-bold text-slate-500">au</span>
                    <input
                      type="date"
                      value={notifTo}
                      min={notifFrom || undefined}
                      onChange={(event) => setNotifTo(event.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-400"
                    />
                    {notifFrom || notifTo ? (
                      <button
                        type="button"
                        onClick={() => {
                          setNotifFrom("");
                          setNotifTo("");
                        }}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200"
                      >
                        Effacer dates
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={toggleSelectAllVisibleNotifs}
                      className="flex items-center gap-1.5 text-xs font-black text-slate-600 transition hover:text-slate-900"
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded border-2 ${allVisibleNotifsSelected ? "border-rose-500 bg-rose-500 text-white" : "border-slate-300 text-transparent"}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      Tout sélectionner
                    </button>
                    {selectedNotifs.length ? (
                      <span className="text-xs font-bold text-slate-500">{selectedNotifs.length} sélectionnée(s)</span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {visibleNotifications.length ? (
                  <ul className="space-y-3">
                    {visibleNotifications.map((item) => {
                      const selected = selectedNotifs.includes(item.id);
                      return (
                        <li
                          key={item.id}
                          className={`flex items-start gap-3 rounded-2xl border p-3 transition ${selected
                              ? "border-rose-300 bg-rose-50"
                              : item.read
                                ? "border-slate-200 bg-white"
                                : "border-brand-300 bg-brand-50"
                            }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSelectNotif(item.id)}
                            aria-pressed={selected}
                            aria-label="Sélectionner"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${selected
                                ? "border-rose-500 bg-rose-500 text-white"
                                : "border-slate-300 text-transparent hover:border-slate-400"
                              }`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${item.read ? "font-medium text-slate-600" : "font-bold text-slate-900"}`}>{item.text}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(item.date).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <div className="mt-0.5 flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleNotificationRead(item.id)}
                              title={item.read ? "Marquer comme non lu" : "Marquer comme lu"}
                              aria-label={item.read ? "Marquer comme non lu" : "Marquer comme lu"}
                              className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-wide transition ${item.read ? "border-slate-300 text-slate-500 hover:border-slate-400" : "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100"}`}
                            >
                              {item.read ? "Lu" : "Non lu"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteNotification(item.id)}
                              title="Supprimer"
                              aria-label="Supprimer la notification"
                              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-400 hover:text-rose-500"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-display text-lg font-black text-slate-900">
                      {notifications.length ? "Aucune notification dans ce filtre" : "Aucune notification"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Vos notifications d'achat apparaîtront ici.</p>
                  </div>
                )}
              </div>

              {notifications.length ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-200 px-5 py-4">
                  {selectedNotifs.length ? (
                    <button
                      type="button"
                      onClick={markSelectedNotifsRead}
                      className="flex-1 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-black text-brand-700 transition hover:bg-brand-100"
                    >
                      Marquer lu ({selectedNotifs.length})
                    </button>
                  ) : null}
                  {selectedNotifs.length ? (
                    <button
                      type="button"
                      onClick={deleteSelectedNotifs}
                      className="flex-1 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-black text-rose-600 transition hover:bg-rose-100"
                    >
                      Supprimer ({selectedNotifs.length})
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={clearNotifications}
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-rose-400 hover:text-rose-600"
                  >
                    Tout effacer
                  </button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
        : null}

      {isChatOpen && typeof document !== "undefined"
        ? createPortal(
          <div
            className="fixed inset-0 z-[95] grid place-items-center p-4"
            style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Messagerie avec Coach Hicham"
            onClick={() => {
              stopChatRecording();
              setIsChatOpen(false);
            }}
          >
            <div
              className="flex h-[80vh] max-h-[640px] w-[min(100%,32rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  {__hmIsCoach ? (
                    <>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1Z" /><path d="m4.5 6.5 7.5 5 7.5-5" /></svg>
                      </span>
                      <h2 className="font-display text-base font-black text-slate-900">Ma messagerie</h2>
                    </>
                  ) : (
                    <>
                      <img src={coachHero} alt="Coach Hicham" className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <h2 className="font-display text-base font-black text-slate-900">Coach Hicham</h2>
                        <p className={`flex items-center gap-1.5 text-xs font-bold ${coachOnline ? "text-brand-600" : "text-rose-500"}`}>
                          <span className={`h-2 w-2 rounded-full ${coachOnline ? "bg-brand-500" : "bg-rose-500"}`} />
                          {coachOnline ? "En ligne" : "Hors ligne"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopChatRecording();
                    setIsChatOpen(false);
                  }}
                  aria-label="Fermer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {__hmIsCoach ? (
                <CoachChatInbox />
              ) : (
              <>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
                {chatMessages.map((message) => {
                  const isCoach = message.from === "coach";
                  const isEditing = editingMessageId === message.id;
                  const reactions = Array.isArray(message.reactions) ? message.reactions : [];

                  const actionButtons = (
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setReactionPickerId((current) => (current === message.id ? null : message.id))}
                        title="Réagir"
                        aria-label="Réagir"
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition hover:bg-slate-200 hover:text-slate-700 ${reactions.length > 0 ? "bg-slate-200" : "text-slate-400"}`}
                      >
                        {reactions.length > 0 ? reactions[0] : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <path d="M9 9h.01M15 9h.01" />
                          </svg>
                        )}
                      </button>
                      {!isCoach && message.type === "text" ? (
                        <button
                          type="button"
                          onClick={() => startEditMessage(message)}
                          title="Modifier"
                          aria-label="Modifier"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                      ) : null}
                      {!isCoach ? (
                        <button
                          type="button"
                          onClick={() => deleteChatMessage(message.id)}
                          title="Supprimer"
                          aria-label="Supprimer"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-100 hover:text-rose-500"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  );

                  const CHAT_EMOJIS = ["👍","👎","❤️","🔥","😂","😮","😢","😡","💪","🎉","🙏","👏","😍","🤔","💯","🥇","😎","🏆","✅","⚡","💥","🤩","😴","🤣","🫶"];
                  const picker =
                    reactionPickerId === message.id ? (
                      <div className="flex max-w-[16rem] flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
                        {CHAT_EMOJIS.map((emoji) => (
                          <button key={emoji} type="button" onClick={() => toggleChatReaction(message.id, emoji)} className={`text-base transition hover:scale-125 rounded-full p-0.5 ${reactions.includes(emoji) ? "bg-brand-100 ring-1 ring-brand-400" : ""}`}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    ) : null;

                  const reactionChips = reactions.length ? (
                    <div className={`flex flex-wrap gap-1 ${isCoach ? "justify-start pl-9" : "justify-end"}`}>
                      {reactions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleChatReaction(message.id, emoji)}
                          className="rounded-full border border-brand-300 bg-brand-50 px-2 py-0.5 text-xs shadow-sm font-bold text-slate-700 hover:bg-brand-100 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : null;

                  const timeLine = (
                    <p className={`mt-1 flex items-center gap-1 text-[10px] ${isCoach ? "justify-start text-slate-400" : "justify-end text-slate-900/60"}`}>
                      {message.edited ? <span>(modifié)</span> : null}
                      {new Date(message.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  );

                  const bubbleInner = isEditing ? (
                    <div className="w-56">
                      <textarea
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-brand-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none"
                      />
                      <div className="mt-1 flex justify-end gap-1">
                        <button type="button" onClick={cancelEditMessage} className="rounded-lg bg-white/70 px-2 py-1 text-xs font-black text-slate-700">
                          Annuler
                        </button>
                        <button type="button" onClick={saveEditMessage} className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-black text-white">
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.type === "text" ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : null}
                      {message.type === "image" ? <img src={message.dataUrl} alt={message.fileName || "image"} className="max-h-52 rounded-xl" /> : null}
                      {message.type === "voice" ? <VoicePlayer src={message.dataUrl} isMine={!isCoach} /> : null}
                      {message.type === "file" ? (
                        <a href={message.dataUrl} download={message.fileName} className="flex items-center gap-2 font-bold underline">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                          </svg>
                          {message.fileName}
                        </a>
                      ) : null}
                      {timeLine}
                    </>
                  );

                  if (isCoach) {
                    return (
                      <div key={message.id} className="flex flex-col items-start gap-1">
                        <div className="flex max-w-[90%] items-end gap-1.5">
                          <img src={coachHero} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                          <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                            {bubbleInner}
                          </div>
                          {actionButtons}
                        </div>
                        {picker}
                        {reactionChips}
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex flex-col items-end gap-1">
                      <div className="flex max-w-[90%] items-center gap-1.5">
                        {actionButtons}
                        <div className="rounded-2xl rounded-br-sm bg-brand-400 px-3 py-2 text-sm text-slate-950">
                          {bubbleInner}
                        </div>
                      </div>
                      {picker}
                      {reactionChips}
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 border-t border-slate-200 px-3 py-3">
                {isRecording ? (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-black text-rose-600">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" /> Enregistrement…
                    </span>
                    <button
                      type="button"
                      onClick={stopChatRecording}
                      className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-600"
                    >
                      Stop &amp; envoyer
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => chatFileInputRef.current && chatFileInputRef.current.click()}
                      title="Joindre un fichier"
                      aria-label="Joindre un fichier"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => chatImageInputRef.current && chatImageInputRef.current.click()}
                      title="Joindre une photo"
                      aria-label="Joindre une photo"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
                      </svg>
                    </button>
                    <textarea
                      value={chatText}
                      onChange={(event) => setChatText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendChatText();
                        }
                      }}
                      rows={1}
                      placeholder="Écrire un message..."
                      className="max-h-28 min-h-[2.25rem] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400"
                    />
                    <button
                      type="button"
                      onClick={startChatRecording}
                      title="Message vocal"
                      aria-label="Message vocal"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:border-brand-400 hover:text-slate-900"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <path d="M12 19v4M8 23h8" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={sendChatText}
                      disabled={!chatText.trim()}
                      aria-label="Envoyer"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-brand-300 bg-brand-400 text-slate-950 transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M22 2 11 13" />
                        <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                      </svg>
                    </button>
                  </div>
                )}
                <input ref={chatFileInputRef} type="file" className="hidden" onChange={handleChatFile} />
                <input ref={chatImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleChatFile} />
              </div>
              </>
              )}
            </div>
          </div>,
          document.body
        )
        : null}
    </section>
  );
}

function SelectWithOtherField({
  label,
  value,
  customValue,
  options,
  otherValue = "Autre",
  customPlaceholder = "Précise",
  onChange,
  onCustomChange,
  selectClass
}) {
  const isOther = value === otherValue;

  return (
    <label className="block text-xs font-semibold text-slate-300">
      <span>{label}</span>
      {isOther ? (
        <div className="profile-other-combo">
          <select value={value} onChange={(event) => onChange(event.target.value)} className="profile-other-combo__select">
            <option value="">{label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={customValue}
            onChange={(event) => onCustomChange(event.target.value)}
            className="profile-other-combo__input"
            placeholder={customPlaceholder}
          />
        </div>
      ) : (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

function StatusLabelWithInfo({ label, help }) {
  const helpItems = Object.entries(help || {}).filter(([key, value]) => key !== "title" && value);
  const title = help?.title || "Information";

  return (
    <span className="profile-status-label">
      <span className="profile-status-help" tabIndex={0} aria-label={title}>
        <SettingsIcon name="info" className="h-3.5 w-3.5" />
        <span className="profile-status-tooltip" role="tooltip">
          <strong>{title}</strong>
          {helpItems.map(([key, value]) => (
            <span key={key}>{value}</span>
          ))}
        </span>
      </span>
      <span>{label}</span>
    </span>
  );
}

function SportGoalField({
  profileText,
  sportProfileForm,
  setSportProfileForm,
  authInputClass,
  authSelectClass,
  getSportGoalLabel,
  className = ""
}) {
  const isOtherGoal = sportProfileForm.sportGoal === "other";

  return (
    <div className={`grid gap-2 ${className}`}>
      <label className="block text-xs font-semibold text-slate-300">
        <span>{profileText.sportGoal}</span>
        {isOtherGoal ? (
          <div className="profile-other-combo">
            <select
              value={sportProfileForm.sportGoal}
              onChange={(event) =>
                setSportProfileForm((prev) => ({
                  ...prev,
                  sportGoal: event.target.value,
                  sportGoalCustom: event.target.value === "other" ? prev.sportGoalCustom : ""
                }))
              }
              className="profile-other-combo__select"
            >
              <option value="">{profileText.sportGoal}</option>
              {sportGoalValues.map((value) => (
                <option key={value} value={value}>
                  {getSportGoalLabel(value)}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={sportProfileForm.sportGoalCustom}
              onChange={(event) => setSportProfileForm((prev) => ({ ...prev, sportGoalCustom: event.target.value }))}
              className="profile-other-combo__input"
              placeholder={profileText.sportGoalCustom || "Précise ton objectif"}
            />
          </div>
        ) : (
          <select
            value={sportProfileForm.sportGoal}
            onChange={(event) =>
              setSportProfileForm((prev) => ({
                ...prev,
                sportGoal: event.target.value,
                sportGoalCustom: event.target.value === "other" ? prev.sportGoalCustom : ""
              }))
            }
            className={authSelectClass}
          >
            <option value="">{profileText.sportGoal}</option>
            {sportGoalValues.map((value) => (
              <option key={value} value={value}>
                {getSportGoalLabel(value)}
              </option>
            ))}
          </select>
        )}
      </label>
    </div>
  );
}

function DietarySupplementsEditor({
  profileText,
  sportProfileForm,
  setSportProfileForm,
  updateSupplementEntry,
  addSupplementEntry,
  removeSupplementEntry,
  authInputClass,
  authSelectClass,
  preventInvalidNumberKey,
  sanitizePositiveNumberInput
}) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 rounded-2xl border border-slate-600/45 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
        <input
          type="checkbox"
          checked={sportProfileForm.hasNoSupplement}
          onChange={(event) =>
            setSportProfileForm((prev) => ({
              ...prev,
              hasNoSupplement: event.target.checked,
              supplements: event.target.checked ? [{ ...emptySupplementEntry }] : prev.supplements
            }))
          }
          className="h-4 w-4 accent-emerald-400"
        />
        <span>{profileText.noSupplement || "Aucun complément alimentaire"}</span>
      </label>

      {!sportProfileForm.hasNoSupplement ? (
        <div className="space-y-3">
          {sportProfileForm.supplements.map((supplement, index) => (
            <div key={`settings-supplement-entry-${index}`} className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
                  {profileText.supplementNumber || "Complément"} {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeSupplementEntry(index)}
                  className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                >
                  {profileText.removeSupplement || profileText.removeSport}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectWithOtherField
                  label={profileText.supplementName || "Nom du complément"}
                  value={supplement.name}
                  customValue={supplement.customName}
                  options={supplementNameOptions}
                  customPlaceholder={profileText.supplementCustomValue || "Précise"}
                  selectClass={authSelectClass}
                  onChange={(value) =>
                    updateSupplementEntry(index, {
                      name: value,
                      customName: value === "Autre" ? supplement.customName : ""
                    })
                  }
                  onCustomChange={(value) => updateSupplementEntry(index, { customName: value })}
                />
                <label className="block text-xs font-semibold text-slate-300">
                  <span>{profileText.supplementDose || "Dose / Quantité"}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={supplement.dose}
                    onKeyDown={preventInvalidNumberKey}
                    onChange={(event) =>
                      updateSupplementEntry(index, {
                        dose: sanitizePositiveNumberInput(event.target.value, { maxDecimals: 2 })
                      })
                    }
                    className={authInputClass}
                    inputMode="decimal"
                  />
                </label>
                <SelectWithOtherField
                  label={profileText.supplementUnit || "Unité"}
                  value={supplement.unit}
                  customValue={supplement.customUnit}
                  options={supplementUnitOptions}
                  otherValue="autre"
                  customPlaceholder={profileText.supplementCustomValue || "Précise"}
                  selectClass={authSelectClass}
                  onChange={(value) =>
                    updateSupplementEntry(index, {
                      unit: value,
                      customUnit: value === "autre" ? supplement.customUnit : ""
                    })
                  }
                  onCustomChange={(value) => updateSupplementEntry(index, { customUnit: value })}
                />
                <SelectWithOtherField
                  label={profileText.supplementFrequency || "Fréquence"}
                  value={supplement.frequency}
                  customValue={supplement.customFrequency}
                  options={supplementFrequencyOptions}
                  customPlaceholder={profileText.supplementCustomValue || "Précise"}
                  selectClass={authSelectClass}
                  onChange={(value) =>
                    updateSupplementEntry(index, {
                      frequency: value,
                      customFrequency: value === "Autre" ? supplement.customFrequency : ""
                    })
                  }
                  onCustomChange={(value) => updateSupplementEntry(index, { customFrequency: value })}
                />
                <SelectWithOtherField
                  label={profileText.supplementTiming || "Moment de prise"}
                  value={supplement.timing}
                  customValue={supplement.customTiming}
                  options={supplementTimingOptions}
                  customPlaceholder={profileText.supplementCustomValue || "Précise"}
                  selectClass={authSelectClass}
                  onChange={(value) =>
                    updateSupplementEntry(index, {
                      timing: value,
                      customTiming: value === "Autre" ? supplement.customTiming : ""
                    })
                  }
                  onCustomChange={(value) => updateSupplementEntry(index, { customTiming: value })}
                />
                <SelectWithOtherField
                  label={profileText.supplementCategory || "Catégorie"}
                  value={supplement.category}
                  customValue={supplement.customCategory}
                  options={supplementCategoryOptions}
                  customPlaceholder={profileText.supplementCustomValue || "Précise"}
                  selectClass={authSelectClass}
                  onChange={(value) =>
                    updateSupplementEntry(index, {
                      category: value,
                      customCategory: value === "Autre" ? supplement.customCategory : ""
                    })
                  }
                  onCustomChange={(value) => updateSupplementEntry(index, { customCategory: value })}
                />
                <label className="block text-xs font-semibold text-slate-300">
                  <span>
                    {profileText.supplementStartDate || "Date de début"} ({profileText.optional})
                  </span>
                  <input
                    type="date"
                    value={supplement.startDate}
                    onChange={(event) => updateSupplementEntry(index, { startDate: event.target.value })}
                    className={authInputClass}
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <StatusLabelWithInfo
                    label={profileText.supplementStatus || "Statut"}
                    help={profileText.supplementStatusHelp}
                  />
                  <select
                    value={supplement.status}
                    onChange={(event) => updateSupplementEntry(index, { status: event.target.value })}
                    className={authSelectClass}
                  >
                    {supplementStatusValues.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                  <span>{profileText.supplementRemark || "Remarque"} ({profileText.optional})</span>
                  <textarea
                    value={supplement.remark}
                    onChange={(event) => updateSupplementEntry(index, { remark: event.target.value })}
                    placeholder={profileText.supplementRemarkPlaceholder || "Exemple : à prendre avec de l’eau, après le repas ..."}
                    className={`${authInputClass} min-h-[86px] resize-y`}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSupplementEntry}
            className="rounded-xl border border-brand-300/70 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-200 transition hover:border-brand-200 hover:bg-brand-500/15"
          >
            {profileText.addSupplement || "Ajouter un complément"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function HealthInformationEditor({
  profileText,
  sportProfileForm,
  setSportProfileForm,
  updateInjuryEntry,
  addInjuryEntry,
  removeInjuryEntry,
  updateMedicalEntry,
  addMedicalEntry,
  removeMedicalEntry,
  authInputClass,
  authSelectClass
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
            {profileText.injuries}
          </h3>
          {!sportProfileForm.hasNoInjury ? (
            <button
              type="button"
              onClick={addInjuryEntry}
              className="rounded-lg border border-brand-300/60 px-2.5 py-1 text-[11px] font-bold text-brand-200 transition hover:border-brand-200"
            >
              {profileText.addInjury || "Ajouter une blessure"}
            </button>
          ) : null}
        </div>
        <label className="mb-3 flex items-center gap-3 rounded-xl border border-slate-700/55 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
          <input
            type="checkbox"
            checked={sportProfileForm.hasNoInjury}
            onChange={(event) =>
              setSportProfileForm((prev) => ({
                ...prev,
                hasNoInjury: event.target.checked,
                injuryEntries: event.target.checked ? [{ ...emptyInjuryEntry }] : prev.injuryEntries
              }))
            }
            className="h-4 w-4 accent-emerald-400"
          />
          <span>{profileText.noInjury || "Aucune blessure"}</span>
        </label>
        {!sportProfileForm.hasNoInjury ? (
          <div className="space-y-3">
            {sportProfileForm.injuryEntries.map((injury, index) => (
              <div key={`settings-injury-entry-${index}`} className="rounded-xl border border-slate-700/55 bg-slate-950/30 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                    {profileText.injuryNumber || "Blessure"} {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeInjuryEntry(index)}
                    className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                  >
                    {profileText.removeInjury || profileText.removeSport}
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectWithOtherField
                    label={profileText.injuryZone || "Zone concernée"}
                    value={injury.zone}
                    customValue={injury.customZone}
                    options={injuryZoneOptions}
                    customPlaceholder={profileText.supplementCustomValue || "Précise"}
                    selectClass={authSelectClass}
                    onChange={(value) =>
                      updateInjuryEntry(index, {
                        zone: value,
                        customZone: value === "Autre" ? injury.customZone : ""
                      })
                    }
                    onCustomChange={(value) => updateInjuryEntry(index, { customZone: value })}
                  />
                  <label className="block text-xs font-semibold text-slate-300">
                    <span>{profileText.injuryStartDate || "Date de début"} ({profileText.optional})</span>
                    <input
                      type="date"
                      value={injury.startDate}
                      onChange={(event) => updateInjuryEntry(index, { startDate: event.target.value })}
                      className={authInputClass}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-300">
                    <StatusLabelWithInfo
                      label={profileText.injuryStatus || "Statut"}
                      help={profileText.injuryStatusHelp}
                    />
                    <select
                      value={injury.status}
                      onChange={(event) => updateInjuryEntry(index, { status: event.target.value })}
                      className={authSelectClass}
                    >
                      {healthStatusValues.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                    <span>{profileText.injuryRemark || "Remarque"} ({profileText.optional})</span>
                    <textarea
                      value={injury.remark}
                      onChange={(event) => updateInjuryEntry(index, { remark: event.target.value })}
                      placeholder={profileText.injuryRemarkPlaceholder || "Exemple : douleur légère après l’entraînement"}
                      className={`${authInputClass} min-h-[78px] resize-y`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
            {profileText.medicalTitle || "Informations médicales"}
          </h3>
          {!sportProfileForm.hasNoMedicalInformation ? (
            <button
              type="button"
              onClick={addMedicalEntry}
              className="rounded-lg border border-brand-300/60 px-2.5 py-1 text-[11px] font-bold text-brand-200 transition hover:border-brand-200"
            >
              {profileText.addMedical || "Ajouter"}
            </button>
          ) : null}
        </div>
        <label className="mb-3 flex items-center gap-3 rounded-xl border border-slate-700/55 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
          <input
            type="checkbox"
            checked={sportProfileForm.hasNoMedicalInformation}
            onChange={(event) =>
              setSportProfileForm((prev) => ({
                ...prev,
                hasNoMedicalInformation: event.target.checked,
                medicalEntries: event.target.checked ? [{ ...emptyMedicalEntry }] : prev.medicalEntries
              }))
            }
            className="h-4 w-4 accent-emerald-400"
          />
          <span>{profileText.noMedicalInformation || "Aucune information médicale"}</span>
        </label>
        {!sportProfileForm.hasNoMedicalInformation ? (
          <div className="space-y-3">
            {sportProfileForm.medicalEntries.map((medical, index) => (
              <div key={`settings-medical-entry-${index}`} className="rounded-xl border border-slate-700/55 bg-slate-950/30 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                    {profileText.medicalNumber || "Problème médical"} {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeMedicalEntry(index)}
                    className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                  >
                    {profileText.removeMedical || profileText.removeSport}
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectWithOtherField
                    label={profileText.medicalProblemName || "Nom du problème médical"}
                    value={medical.name}
                    customValue={medical.customName}
                    options={medicalProblemOptions}
                    customPlaceholder={profileText.supplementCustomValue || "Précise"}
                    selectClass={authSelectClass}
                    onChange={(value) =>
                      updateMedicalEntry(index, {
                        name: value,
                        customName: value === "Autre" ? medical.customName : ""
                      })
                    }
                    onCustomChange={(value) => updateMedicalEntry(index, { customName: value })}
                  />
                  <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                    <span>{profileText.medicalDescription || "Description"}</span>
                    <textarea
                      value={medical.description}
                      onChange={(event) => updateMedicalEntry(index, { description: event.target.value })}
                      className={`${authInputClass} min-h-[78px] resize-y`}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-300">
                    <span>{profileText.medicalStartDate || "Date de début"} ({profileText.optional})</span>
                    <input
                      type="date"
                      value={medical.startDate}
                      onChange={(event) => updateMedicalEntry(index, { startDate: event.target.value })}
                      className={authInputClass}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-300">
                    <StatusLabelWithInfo
                      label={profileText.medicalStatus || "Statut"}
                      help={profileText.medicalStatusHelp}
                    />
                    <select
                      value={medical.status}
                      onChange={(event) => updateMedicalEntry(index, { status: event.target.value })}
                      className={authSelectClass}
                    >
                      {healthStatusValues.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                    <span>{profileText.medicalRemark || "Remarque"} ({profileText.optional})</span>
                    <textarea
                      value={medical.remark}
                      onChange={(event) => updateMedicalEntry(index, { remark: event.target.value })}
                      placeholder={profileText.medicalRemarkPlaceholder || "Exemple : je ressens parfois une gêne pendant l’effort physique"}
                      className={`${authInputClass} min-h-[78px] resize-y`}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SettingsPage({
  isCoach = false,
  coachContent = null,
  currentUser,
  athleteSex,
  settingsForm,
  setSettingsForm,
  settingsFeedback,
  setSettingsFeedback,
  isSettingsSaving,
  onSubmit,
  onBack,
  onGoToShop,
  onDeleteAccount,
  onAvatarFileChange,
  countryOptions,
  sportProfileForm,
  setSportProfileForm,
  updateSportEntry,
  addSportEntry,
  removeSportEntry,
  updateSupplementEntry,
  addSupplementEntry,
  removeSupplementEntry,
  updateInjuryEntry,
  addInjuryEntry,
  removeInjuryEntry,
  updateMedicalEntry,
  addMedicalEntry,
  removeMedicalEntry,
  profileText,
  getSportLevelLabel,
  getSportGoalLabel,
  authInputClass,
  authSelectClass,
  preventInvalidNumberKey,
  sanitizePositiveNumberInput,
  settingsPasswordChecks
}) {
  const phoneDialCode = settingsForm.country ? getCountryDialCode(settingsForm.country) : settingsForm.phoneCountryCode || "+";
  const phoneDialCountryName =
    countryOptions.find((country) => country.code === settingsForm.country)?.name || "Pays";
  const avatarInitials = getInitials(`${settingsForm.firstName} ${settingsForm.lastName}`.trim() || currentUser?.fullName || "");
  const avatarOptions = isCoach ? coachAvatarCatalog : getAthleteAvatarOptions(athleteSex || currentUser?.sex);
  const avatarSexLabel = isCoach ? "Coach" : getAthleteSexLabel(athleteSex || currentUser?.sex);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const cartCount = (() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = window.localStorage.getItem("hm-shop-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="settings-hero shrink-0">
        <div className="settings-hero__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="settings-hero__title">Paramètres</h1>
          <p className="settings-hero__subtitle">
            Gère ton identité, ton profil sportif, tes coordonnées et ta sécurité.
          </p>
        </div>
        <div className="settings-hero__actions" aria-label="Actions rapides">
          {!isCoach && (
            <>
              <button
                type="button"
                onClick={onBack}
                className="settings-hero__back"
                aria-label="Revenir en arrière"
                title="Revenir en arrière"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18 9 12l6-6" />
                  <path d="M9 12h11" />
                </svg>
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={onGoToShop}
                className="settings-hero__action"
                aria-label="Panier"
                title="Voir le panier (boutique)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </>
          )}
          <CoachInbox />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        onClick={(event) => {
          const actionButton = event.target.closest?.("[data-settings-action]");
          if (actionButton) {
            event.currentTarget.dataset.submitAction = actionButton.dataset.settingsAction || "";
          }
        }}
        className="settings-scroll mt-2 min-h-0 flex-1 overflow-y-auto pr-1"
      >
        <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-2">
            <article className="settings-card">
              <SettingsSectionHeader
                icon="profile"
                eyebrow="Profil"
                title="Informations personnelles"
                action={<span className="settings-chip is-required">Obligatoire</span>}
              />

              <div className="mt-4 grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex flex-col items-center gap-2">
                  <div className="settings-avatar-preview">
                    {settingsForm.avatarUrl ? (
                      <img src={settingsForm.avatarUrl} alt="" />
                    ) : (
                      <span>{avatarInitials || "HF"}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Photo de profil</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    <span>Prénom</span>
                    <input
                      type="text"
                      value={settingsForm.firstName}
                      onChange={(event) => setSettingsForm((prev) => ({ ...prev, firstName: event.target.value }))}
                      className={authInputClass}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-300">
                    <span>Nom</span>
                    <input
                      type="text"
                      value={settingsForm.lastName}
                      onChange={(event) => setSettingsForm((prev) => ({ ...prev, lastName: event.target.value }))}
                      className={authInputClass}
                    />
                  </label>
                  <div className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                    <span>Photo de profil</span>
                    <p className="settings-avatar-note">
                      Choisissez votre photo de profil personnelle ou sélectionnez un avatar sportif qui vous représente.
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <label className="settings-avatar-upload">
                        <input type="file" accept="image/*" onChange={onAvatarFileChange} />
                        {settingsForm.avatarUrl ? "Modifier la photo" : "Ajouter une photo"}
                      </label>
                      {settingsForm.avatarUrl ? (
                        <button
                          type="button"
                          onClick={() => setSettingsForm((prev) => ({ ...prev, avatarUrl: "" }))}
                          className="settings-avatar-remove"
                        >
                          Retirer
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="settings-avatar-gallery sm:col-span-2">
                    <div className="settings-avatar-gallery__header">
                      <span>Choisir un avatar</span>
                      <strong>{avatarSexLabel}</strong>
                    </div>
                    <div className="settings-avatar-grid">
                      {avatarOptions.map((avatarSrc, index) => (
                        <button
                          key={avatarSrc}
                          type="button"
                          onClick={() => {
                            setSettingsForm((prev) => ({ ...prev, avatarUrl: avatarSrc }));
                            setSettingsFeedback?.({
                              type: "success",
                              text: "Avatar sélectionné. Clique sur Enregistrer le profil pour le garder."
                            });
                          }}
                          className={`settings-avatar-choice${settingsForm.avatarUrl === avatarSrc ? " is-selected" : ""}`}
                          aria-label={`Choisir avatar ${index + 1}`}
                        >
                          <img src={avatarSrc} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                    <span>Pays de résidence</span>
                    <select
                      value={settingsForm.country}
                      onChange={(event) => {
                        const nextCountry = event.target.value;
                        setSettingsForm((prev) => ({
                          ...prev,
                          country: nextCountry,
                          phoneCountryCode: getCountryDialCode(nextCountry),
                          phoneVerifiedAt: ""
                        }));
                      }}
                      className={authSelectClass}
                    >
                      <option value="">Pays de résidence</option>
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                data-settings-action="profile"
                disabled={isSettingsSaving}
                className="settings-card-save-button mt-4 w-full"
              >
                Enregistrer le profil
              </button>
            </article>

            {!isCoach && (
              <>
            <article className="settings-card">
              <SettingsSectionHeader
                icon="address"
                eyebrow="Coordonnées"
                title="Téléphone et adresse"
                action={<span className="settings-chip is-optional">Optionnel</span>}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="settings-subsection-heading sm:col-span-2">
                  <span className="settings-subsection-heading__icon">
                    <SettingsIcon name="phone" className="h-3.5 w-3.5" />
                  </span>
                  <span>Téléphone</span>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    <span>Numéro de téléphone</span>
                    <div className="mt-1.5 flex overflow-hidden rounded-xl border border-slate-600/60 bg-slate-950/35">
                      <span className="settings-phone-code" aria-label={`Indicatif pays ${phoneDialCountryName}`}>
                        <strong>{phoneDialCode}</strong>
                        <span>{phoneDialCountryName}</span>
                      </span>
                      <input
                        type="tel"
                        value={settingsForm.phoneNumber}
                        onChange={(event) =>
                          setSettingsForm((prev) => ({ ...prev, phoneNumber: event.target.value, phoneVerifiedAt: "" }))
                        }
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none"
                        inputMode="tel"
                        placeholder="6 00 00 00 00"
                      />
                    </div>
                  </label>
                </div>

                <div className="settings-subsection-heading mt-2 sm:col-span-2">
                  <span className="settings-subsection-heading__icon">
                    <SettingsIcon name="address" className="h-3.5 w-3.5" />
                  </span>
                  <span>Adresse</span>
                </div>
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                  <span>Adresse</span>
                  <input
                    type="text"
                    value={settingsForm.addressLine1}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, addressLine1: event.target.value }))}
                    className={authInputClass}
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                  <span>Complément d’adresse</span>
                  <input
                    type="text"
                    value={settingsForm.addressLine2}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, addressLine2: event.target.value }))}
                    className={authInputClass}
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Code postal</span>
                  <input
                    type="text"
                    value={settingsForm.postalCode}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, postalCode: event.target.value }))}
                    className={authInputClass}
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Ville</span>
                  <input
                    type="text"
                    value={settingsForm.city}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, city: event.target.value }))}
                    className={authInputClass}
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                  <span>Région / Province / Wilaya</span>
                  <input
                    type="text"
                    value={settingsForm.region}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, region: event.target.value }))}
                    className={authInputClass}
                  />
                </label>
              </div>
              <button
                type="submit"
                data-settings-action="contact"
                disabled={isSettingsSaving}
                className="settings-card-save-button mt-4 w-full"
              >
                Enregistrer les coordonnées
              </button>
            </article>

            <article className="settings-card">
              <SettingsSectionHeader
                icon="athlete"
                eyebrow="Athlète"
                title="Profil sportif"
                action={<span className="settings-chip is-required">{profileText.required}</span>}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-slate-300">
                  <span>{profileText.heightCm}</span>
                  <input
                    type="number"
                    min="80"
                    max="260"
                    value={sportProfileForm.heightCm}
                    onKeyDown={preventInvalidNumberKey}
                    onChange={(event) =>
                      setSportProfileForm((prev) => ({
                        ...prev,
                        heightCm: sanitizePositiveNumberInput(event.target.value, { integer: true })
                      }))
                    }
                    className={authInputClass}
                    inputMode="numeric"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>{profileText.currentWeightKg}</span>
                  <input
                    type="number"
                    min="25"
                    max="350"
                    step="0.1"
                    value={sportProfileForm.currentWeightKg}
                    onKeyDown={preventInvalidNumberKey}
                    onChange={(event) =>
                      setSportProfileForm((prev) => ({
                        ...prev,
                        currentWeightKg: sanitizePositiveNumberInput(event.target.value)
                      }))
                    }
                    className={authInputClass}
                    inputMode="decimal"
                  />
                </label>
              </div>

              <label className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-600/45 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={sportProfileForm.hasNoSport}
                  onChange={(event) =>
                    setSportProfileForm((prev) => ({
                      ...prev,
                      hasNoSport: event.target.checked,
                      sports: event.target.checked ? [{ ...emptySportEntry }] : prev.sports
                    }))
                  }
                  className="h-4 w-4 accent-emerald-400"
                />
                <span>{profileText.noSport}</span>
              </label>

              {!sportProfileForm.hasNoSport ? (
                <div className="mt-3 space-y-3">
                  {sportProfileForm.sports.map((sport, index) => (
                    <div key={`settings-sport-${index}`} className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
                          {profileText.sportNumber} {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeSportEntry(index)}
                          className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                        >
                          {profileText.removeSport}
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="block text-xs font-semibold text-slate-300">
                          <span>{profileText.sportPracticed}</span>
                          <input
                            type="text"
                            value={sport.sportPracticed}
                            onChange={(event) => updateSportEntry(index, { sportPracticed: event.target.value })}
                            className={authInputClass}
                          />
                        </label>
                        <label className="block text-xs font-semibold text-slate-300">
                          <span>{profileText.sessionsPerWeek}</span>
                          <input
                            type="number"
                            min="0"
                            max="21"
                            value={sport.sessionsPerWeek}
                            onKeyDown={preventInvalidNumberKey}
                            onChange={(event) =>
                              updateSportEntry(index, {
                                sessionsPerWeek: sanitizePositiveNumberInput(event.target.value, { integer: true })
                              })
                            }
                            className={authInputClass}
                            inputMode="numeric"
                          />
                        </label>
                        <label className="block text-xs font-semibold text-slate-300">
                          <span>{profileText.sportLevel}</span>
                          <select
                            value={sport.sportLevel}
                            onChange={(event) => updateSportEntry(index, { sportLevel: event.target.value })}
                            className={authSelectClass}
                          >
                            <option value="">{profileText.sportLevel}</option>
                            {sportLevelValues.map((value) => (
                              <option key={value} value={value}>
                                {getSportLevelLabel(value)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSportEntry}
                    className="rounded-xl border border-brand-300/70 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-200 transition hover:border-brand-200 hover:bg-brand-500/15"
                  >
                    {profileText.addSport}
                  </button>
                </div>
              ) : null}

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SportGoalField
                  profileText={profileText}
                  sportProfileForm={sportProfileForm}
                  setSportProfileForm={setSportProfileForm}
                  authInputClass={authInputClass}
                  authSelectClass={authSelectClass}
                  getSportGoalLabel={getSportGoalLabel}
                  className="sm:col-span-2"
                />
                <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                  <span>Remarques importantes</span>
                  <textarea
                    value={sportProfileForm.remarks}
                    onChange={(event) => setSportProfileForm((prev) => ({ ...prev, remarks: event.target.value }))}
                    className={`${authInputClass} min-h-[92px] resize-y`}
                  />
                </label>
              </div>
              <button
                type="submit"
                data-settings-action="sport-profile"
                disabled={isSettingsSaving}
                className="settings-card-save-button mt-4 w-full"
              >
                Enregistrer le profil sportif
              </button>
            </article>

            <article className="settings-card">
              <SettingsSectionHeader
                icon="athlete"
                eyebrow="Nutrition"
                title={profileText.supplementsTitle || "Compléments alimentaires"}
                action={<span className="settings-chip is-required">{profileText.required}</span>}
              />
              <div className="mt-4">
                <DietarySupplementsEditor
                  profileText={profileText}
                  sportProfileForm={sportProfileForm}
                  setSportProfileForm={setSportProfileForm}
                  updateSupplementEntry={updateSupplementEntry}
                  addSupplementEntry={addSupplementEntry}
                  removeSupplementEntry={removeSupplementEntry}
                  authInputClass={authInputClass}
                  authSelectClass={authSelectClass}
                  preventInvalidNumberKey={preventInvalidNumberKey}
                  sanitizePositiveNumberInput={sanitizePositiveNumberInput}
                />
              </div>
              <button
                type="submit"
                data-settings-action="nutrition"
                disabled={isSettingsSaving}
                className="settings-card-save-button mt-4 w-full"
              >
                Enregistrer la nutrition
              </button>
            </article>

            <article className="settings-card">
              <SettingsSectionHeader
                icon="info"
                eyebrow="Santé"
                title={profileText.healthTitle || "Blessures et informations médicales"}
                action={<span className="settings-chip is-required">{profileText.required}</span>}
              />
              <div className="mt-4">
                <HealthInformationEditor
                  profileText={profileText}
                  sportProfileForm={sportProfileForm}
                  setSportProfileForm={setSportProfileForm}
                  updateInjuryEntry={updateInjuryEntry}
                  addInjuryEntry={addInjuryEntry}
                  removeInjuryEntry={removeInjuryEntry}
                  updateMedicalEntry={updateMedicalEntry}
                  addMedicalEntry={addMedicalEntry}
                  removeMedicalEntry={removeMedicalEntry}
                  authInputClass={authInputClass}
                  authSelectClass={authSelectClass}
                />
              </div>
              <button
                type="submit"
                data-settings-action="health"
                disabled={isSettingsSaving}
                className="settings-card-save-button mt-4 w-full"
              >
                Enregistrer la santé
              </button>
            </article>
              </>
            )}
            {isCoach ? coachContent : null}
          </div>

          <aside className="space-y-2">
            <article className="settings-card">
              <SettingsSectionHeader icon="security" eyebrow="Compte" title="Compte et sécurité" />

              <div className="mt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Adresse email actuelle</span>
                  <input type="email" value={currentUser?.email || ""} readOnly className={`${authInputClass} opacity-80`} />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Changer l’adresse email</span>
                  <input
                    type="email"
                    value={settingsForm.newEmail}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, newEmail: event.target.value }))}
                    className={authInputClass}
                    placeholder="nouveau@email.com"
                  />
                  <button
                    type="submit"
                    data-settings-action="confirm-email"
                    disabled={isSettingsSaving}
                    className="settings-email-confirm-button mt-2"
                  >
                    <span>Confirmer mon nouvel email</span>
                  </button>
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Mot de passe actuel</span>
                  <input
                    type="password"
                    value={settingsForm.currentPassword}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                    className={authInputClass}
                    autoComplete="current-password"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Changer le mot de passe</span>
                  <input
                    type="password"
                    value={settingsForm.newPassword}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                    className={authInputClass}
                    autoComplete="new-password"
                  />
                </label>
                {settingsForm.newPassword ? (
                  <PasswordRequirements checks={settingsPasswordChecks} labels={null} />
                ) : null}
                <label className="block text-xs font-semibold text-slate-300">
                  <span>Confirmer le mot de passe</span>
                  <input
                    type="password"
                    value={settingsForm.confirmNewPassword}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, confirmNewPassword: event.target.value }))}
                    className={authInputClass}
                    autoComplete="new-password"
                  />
                </label>
                <button
                  type="submit"
                  data-settings-action="password"
                  disabled={isSettingsSaving}
                  className="settings-card-save-button w-full"
                >
                  Changer le mot de passe
                </button>
              </div>
            </article>

            {!isCoach && (
            <article className="settings-card settings-card--danger">
              <SettingsSectionHeader icon="danger" eyebrow="Zone sensible" title="Suppression de compte" danger />
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Vous pouvez supprimer votre compte.
              </p>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="settings-delete-button mt-3 w-full"
              >
                Supprimer mon compte
              </button>
            </article>
            )}
          </aside>
        </div>
        {settingsFeedback.text ? (
          <p className={`mt-2 rounded-2xl border px-3 py-2 text-xs font-bold ${settingsFeedback.type === "success"
              ? "border-brand-300/35 bg-brand-500/10 text-brand-200"
              : "border-red-300/40 bg-red-500/10 text-red-300"
            }`}>
            {settingsFeedback.text}
          </p>
        ) : null}
      </form>
      {deleteModalOpen ? (
        <div className="settings-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="settings-delete-modal__card">
            <p className="settings-card__eyebrow text-red-200">Confirmation</p>
            <h2 id="delete-account-title" className="settings-delete-modal__title">
              Est-ce que vous voulez vraiment supprimer votre compte ?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Cette action supprimera définitivement votre accès à l’espace athlète.
            </p>
            {settingsFeedback.text ? (
              <p className={`mt-3 text-xs ${settingsFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-300"}`}>
                {settingsFeedback.text}
              </p>
            ) : null}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isSettingsSaving}
                className="rounded-xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-sm font-black text-white transition hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={onDeleteAccount}
                disabled={isSettingsSaving}
                className="rounded-xl border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_28px_-16px_rgba(220,38,38,0.95)] transition hover:border-red-500 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSettingsSaving ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function getCountryOptions(language) {
  const locale = countryLocaleMap[language] || "fr";
  if (countryOptionsCache.has(locale)) {
    return countryOptionsCache.get(locale);
  }

  const displayNames =
    typeof Intl !== "undefined" && Intl.DisplayNames
      ? new Intl.DisplayNames([locale], { type: "region" })
      : null;

  const options = countryCodes
    .map((code) => ({ code, name: displayNames?.of(code) || code }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  countryOptionsCache.set(locale, options);
  return options;
}
const navSectionIds = ["services", "certifications", "experiences", "resultats", "contact"];
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const authLoginRoute = "/auth?mode=login&form=1";
// Comptes coach (admin) : détectés par leur email pour ouvrir l'espace coach.
const COACH_EMAILS = ["noreply.hicham.fit@gmail.com", "billalmechekour6@gmail.com"];
const COACH_EMAIL = COACH_EMAILS[0];
const isCoachEmail = (email) => !!email && COACH_EMAILS.includes(String(email).trim().toLowerCase());
// Le coach peut changer son email : on mémorise son identifiant pour le reconnaître ensuite.
const COACH_UID_KEY = "hm-coach-uid";
const rememberCoachUid = (id) => {
  try { if (id) window.localStorage.setItem(COACH_UID_KEY, String(id)); } catch { /* ignore */ }
};
const getRememberedCoachUid = () => {
  try { return window.localStorage.getItem(COACH_UID_KEY) || ""; } catch { return ""; }
};
// Reconnaît le coach par email OU par identifiant mémorisé (résiste au changement d'email).
const isCoachUser = (user) => {
  if (!user) return false;
  if (isCoachEmail(user.email)) return true;
  return !!user.id && String(user.id) === getRememberedCoachUid();
};

// Contacts / réseaux sociaux du footer (éditables par le coach, stockés en base).
const DEFAULT_SITE_CONTACTS = [
  { kind: "facebook", label: "Facebook", value: "https://www.facebook.com/Hicham-fit" },
  { kind: "tiktok", label: "TikTok", value: "https://www.tiktok.com/@mechkour_hicham7" },
  { kind: "whatsapp", label: "WhatsApp", value: "+213779477711" },
  { kind: "email", label: "Email", value: "hichamechkour39@gmail.com" }
];

const CONTACT_KINDS = ["facebook", "tiktok", "instagram", "linkedin", "whatsapp", "youtube", "phone", "email", "website", "custom"];

const CONTACT_ICON_PATHS = {
  facebook: "M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H8v3h2.6v8h2.9Z",
  tiktok: "M14.8 3.1c.6 1.6 1.9 2.8 3.5 3.2v2.3a6.2 6.2 0 0 1-3.2-.9v5.2a5.9 5.9 0 1 1-5.1-5.9v2.4a3.5 3.5 0 1 0 2.7 3.4V2.5h2.1v.6Z",
  whatsapp: "M20.5 3.5A11.8 11.8 0 0 0 1.8 17.7L.5 23.5l5.9-1.2A11.8 11.8 0 1 0 20.5 3.5Zm-8.7 18a9.8 9.8 0 0 1-5-1.4l-.3-.2-3.5.7.8-3.4-.2-.4A9.9 9.9 0 1 1 11.8 21.5Zm5.4-7.4c-.3-.1-1.9-1-2.2-1.1-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.7.1a8.1 8.1 0 0 1-2.4-1.5 8.9 8.9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.3-.6a.6.6 0 0 0 0-.6c-.1-.1-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6a1.2 1.2 0 0 0-.9.4A3.6 3.6 0 0 0 5 9.3a6.2 6.2 0 0 0 1.3 3.3 14.2 14.2 0 0 0 5.3 4.7 17.5 17.5 0 0 0 1.8.7 4.3 4.3 0 0 0 2 .1 3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3Z",
  email: "M3 6.8A1.8 1.8 0 0 1 4.8 5h14.4A1.8 1.8 0 0 1 21 6.8v10.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 17.2V6.8Zm1.8.2 7.2 4.9L19.2 7H4.8Zm14.4 10.2V8.8l-6.7 4.6a.9.9 0 0 1-1 0L4.8 8.8v8.4h14.4Z",
  instagram: "M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm0-2.2A5.4 5.4 0 1 1 6.6 12 5.4 5.4 0 0 1 12 6.6Zm5.6-.3a1.26 1.26 0 1 1-1.26-1.26A1.26 1.26 0 0 1 17.6 6.3ZM12 4.2c-2.5 0-2.8 0-3.8.06-1 .05-1.5.2-1.9.35-.48.19-.82.41-1.18.77-.36.36-.58.7-.77 1.18-.15.4-.3.9-.35 1.9C4 9.2 4 9.5 4 12s0 2.8.06 3.8c.05 1 .2 1.5.35 1.9.19.48.41.82.77 1.18.36.36.7.58 1.18.77.4.15.9.3 1.9.35 1 .06 1.3.06 3.8.06s2.8 0 3.8-.06c1-.05 1.5-.2 1.9-.35.48-.19.82-.41 1.18-.77.36-.36.58-.7.77-1.18.15-.4.3-.9.35-1.9.06-1 .06-1.3.06-3.8s0-2.8-.06-3.8c-.05-1-.2-1.5-.35-1.9a3.18 3.18 0 0 0-.77-1.18 3.18 3.18 0 0 0-1.18-.77c-.4-.15-.9-.3-1.9-.35-1-.06-1.3-.06-3.8-.06Z",
  youtube: "M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.28 5 12 5 12 5s-6.28 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.72 19 12 19 12 19s6.28 0 7.85-.43A2.5 2.5 0 0 0 21.6 16.8 26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z",
  phone: "M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11 21 3 13 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z",
  website: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.6a15.6 15.6 0 0 0-1.2-3.1A8 8 0 0 1 18.9 8ZM12 4c.8 1 1.5 2.4 1.9 4h-3.8c.4-1.6 1.1-3 1.9-4ZM4.3 14a8 8 0 0 1 0-4h2.9a17.6 17.6 0 0 0 0 4H4.3Zm.8 2h2.6c.3 1.1.7 2.2 1.2 3.1A8 8 0 0 1 5.1 16Zm2.6-8H5.1a8 8 0 0 1 3.8-3.1c-.5.9-.9 2-1.2 3.1ZM12 20c-.8-1-1.5-2.4-1.9-4h3.8c-.4 1.6-1.1 3-1.9 4Zm2.3-6H9.7a15.6 15.6 0 0 1 0-4h4.6a15.6 15.6 0 0 1 0 4Zm.6 5.1c.5-.9.9-2 1.2-3.1h2.6a8 8 0 0 1-3.8 3.1Zm1.9-5.1a17.6 17.6 0 0 0 0-4h2.9a8 8 0 0 1 0 4h-2.9Z",
  linkedin: "M6.94 5A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.1 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H8.5V8.4Z",
  custom: "M10.6 13.4a1 1 0 0 0 1.4 0l4-4a3 3 0 0 0-4.2-4.2l-1 1a1 1 0 1 0 1.4 1.4l1-1a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 0 0 1.4Zm2.8-2.8a1 1 0 0 0-1.4 0l-4 4a3 3 0 0 0 4.2 4.2l1-1a1 1 0 0 0-1.4-1.4l-1 1a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 0 0-1.4Z"
};

function contactIconPath(kind) {
  return CONTACT_ICON_PATHS[kind] || CONTACT_ICON_PATHS.custom;
}

function contactHref(contact) {
  const v = String(contact?.value || "").trim();
  if (!v) return "#";
  if (contact.kind === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  if (contact.kind === "whatsapp") return `https://wa.me/${v.replace(/\D/g, "")}`;
  if (contact.kind === "phone") return v.startsWith("tel:") ? v : `tel:${v.replace(/\s+/g, "")}`;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function contactDisplay(contact) {
  const v = String(contact?.value || "").trim();
  if (["email", "phone", "whatsapp"].includes(contact?.kind)) return v;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    const path = u.pathname.replace(/\/+$/, "").replace(/^\//, "");
    return path || u.hostname.replace(/^www\./, "");
  } catch {
    return v;
  }
}
const authEmailRedirectUrl =
  import.meta.env.VITE_AUTH_REDIRECT_URL || "http://localhost:5173/auth?mode=login";
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const resetLinkLifetimeMs = 3 * 60 * 1000;
const resetCodeLifetimeSeconds = Math.floor(resetLinkLifetimeMs / 1000);
const resetPasswordSessionLifetimeMs = 30 * 60 * 1000;
const clientReviewsPerPage = 3;
const reviewMinCharacters = 10;
const reviewMaxCharacters = 200;

function formatAuthSeconds(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function clampResetCodeSeconds(seconds) {
  const value = Math.ceil(Number(seconds) || 0);
  return Math.max(0, Math.min(resetCodeLifetimeSeconds, value));
}

function getResetRequestedAtFromExpiresAt(expiresAtMs) {
  if (!Number.isFinite(expiresAtMs)) {
    return Date.now();
  }

  const requestedAt = expiresAtMs - resetLinkLifetimeMs;
  if (!Number.isFinite(requestedAt) || requestedAt > Date.now()) {
    return Date.now();
  }

  return requestedAt;
}

function getPasswordChecks(password) {
  const value = String(password || "");
  return {
    minLength: value.length >= 12,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    digit: /\d/.test(value),
    symbol: /[!@#$%&*_\-?.]/.test(value)
  };
}

function isPasswordStrong(password) {
  return Object.values(getPasswordChecks(password)).every(Boolean);
}

function PasswordRequirements({ checks, labels }) {
  const fallbackLabels = {
    minLength: "Au moins 12 caracteres",
    lowercase: "Au moins une lettre minuscule : a-z",
    uppercase: "Au moins une lettre majuscule : A-Z",
    digit: "Au moins un chiffre : 0-9",
    symbol: "Au moins un symbole autorise : ! @ # $ % & * _ - ? ."
  };
  const nextLabels = labels || fallbackLabels;
  const requirementColumns = [
    ["minLength", "lowercase", "uppercase"],
    ["digit", "symbol"]
  ];

  return (
    <div className="mt-2 rounded-2xl border border-slate-600/60 bg-slate-950/35 p-2.5">
      <div className="grid gap-2 sm:grid-cols-[1.08fr_0.92fr]">
        {requirementColumns.map((column, columnIndex) => (
          <ul key={columnIndex} className="space-y-1.5 text-[11px] font-semibold">
            {column.map((key) => {
              const label = nextLabels[key];
              const isValid = Boolean(checks[key]);
              if (!label) return null;

              return (
                <li
                  key={key}
                  className={`flex items-start gap-2 transition ${isValid ? "text-emerald-300" : "text-red-300"}`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[9px] leading-none ${isValid ? "border-emerald-300 bg-emerald-400/20" : "border-red-300 bg-red-400/15"
                      }`}
                    aria-hidden="true"
                  >
                    {isValid ? "✓" : "!"}
                  </span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getResetLinkExpiresAt(accessToken) {
  const payload = decodeJwtPayload(accessToken);
  const issuedAtMs = typeof payload?.iat === "number" ? payload.iat * 1000 : 0;

  if (issuedAtMs > 0) {
    return issuedAtMs + resetLinkLifetimeMs;
  }

  return Date.now() + resetLinkLifetimeMs;
}

function isAccessTokenExpired(accessToken, skewMs = 60 * 1000) {
  const payload = decodeJwtPayload(accessToken);
  const expiresAtMs = typeof payload?.exp === "number" ? payload.exp * 1000 : 0;
  return !expiresAtMs || expiresAtMs - skewMs <= Date.now();
}

async function callSupabaseAuth(path, payload) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey
  };

  // Support both legacy anon JWT keys and new publishable keys.
  if (typeof supabaseAnonKey === "string" && supabaseAnonKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.msg || data.error_description || data.message || "SUPABASE_REQUEST_FAILED";
    const error = new Error(message);
    error.code = data.code || data.error_code || "";
    throw error;
  }

  return data;
}

async function callSupabaseVerifyOtp(payload) {
  return callSupabaseAuth("verify", payload);
}

async function callSupabaseRpc(functionName, payload) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey
  };

  if (typeof supabaseAnonKey === "string" && supabaseAnonKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (data && (data.message || data.error_description || data.msg)) || "SUPABASE_RPC_FAILED";
    const error = new Error(message);
    error.code = (data && (data.code || data.error_code)) || "";
    throw error;
  }

  return data;
}

async function callSupabaseRest(path, { method = "GET", accessToken, body, prefer } = {}) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  if (!accessToken) {
    throw new Error("SESSION_REQUIRED");
  }

  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (data && (data.message || data.error_description || data.msg)) || "SUPABASE_REST_FAILED";
    const error = new Error(message);
    error.code = (data && (data.code || data.error_code)) || "";
    error.status = response.status;
    throw error;
  }

  return data;
}

async function fetchSportProfile(userId, accessToken) {
  const data = await callSupabaseRest(
    `profiles?id=eq.${encodeURIComponent(userId)}&select=${encodeURIComponent(sportProfileFields)}`,
    { accessToken }
  );
  return normalizeSportProfile(Array.isArray(data) ? data[0] || {} : data || {});
}

async function updateSportProfile(userId, accessToken, payload) {
  const data = await callSupabaseRest(
    `profiles?id=eq.${encodeURIComponent(userId)}&select=${encodeURIComponent(sportProfileFields)}`,
    {
      method: "PATCH",
      accessToken,
      body: payload,
      prefer: "return=representation"
    }
  );
  return normalizeSportProfile(Array.isArray(data) ? data[0] || payload : data || payload);
}

async function fetchClientReviews() {
  const data = await callSupabaseFunction("client-reviews", { action: "list" });
  return Array.isArray(data.reviews) ? data.reviews.map(normalizeClientReview).filter(Boolean) : [];
}

async function saveClientReview({ accessToken, rating, message }) {
  const data = await callSupabaseFunctionWithAuth(
    "client-reviews",
    {
      action: "save",
      rating,
      message
    },
    accessToken
  );
  return normalizeClientReview(data.review);
}

async function deleteClientReview({ accessToken }) {
  return callSupabaseFunctionWithAuth("client-reviews", { action: "delete" }, accessToken);
}

async function deleteCoachClientReviews({ accessToken, reviewIds, all = false }) {
  const ids = Array.isArray(reviewIds) ? reviewIds.map((id) => String(id || "").trim()).filter(Boolean) : [];
  if (!all && !ids.length) return { success: true, deletedCount: 0 };
  return callSupabaseFunctionWithAuth("client-reviews", { action: "coach-delete", reviewIds: ids, all: !!all }, accessToken);
}

// ===== Messagerie (coach ⇄ athlète) =====
// Fournisseur de session global : permet au chat (CoachInbox) d'obtenir le token sans threader
// les props à travers toutes les barres. App le renseigne avec refreshCurrentUserSession.
let __hmSessionGetter = null;
function setHmSessionGetter(fn) { __hmSessionGetter = fn; }
async function getHmToken() {
  try { const s = __hmSessionGetter ? await __hmSessionGetter() : null; return s?.accessToken || ""; }
  catch { return ""; }
}
// L'athlète connecté est-il le coach ? (le chat ne poste pas côté athlète pour le coach)
let __hmIsCoach = false;
function setHmIsCoach(v) { __hmIsCoach = !!v; }

// Upload un média (vocal, image, fichier) vers Supabase Storage → retourne l'URL publique ou null.
// Upload un média via la edge function messages (action upload-media).
// La edge function crée le bucket automatiquement et retourne l'URL publique.
async function uploadChatMedia(accessToken, dataUrl, kind, _fileName) {
  if (!hasSupabaseConfig || !dataUrl || !accessToken) return null;
  try {
    const comma = dataUrl.indexOf(",");
    if (comma === -1) return null;
    const header = dataUrl.slice(0, comma);
    const base64 = dataUrl.slice(comma + 1);
    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const res = await fetch(`${supabaseUrl}/functions/v1/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "apikey": supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "upload-media", kind, base64, mimeType }),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => ({}));
    return json?.url || null;
  } catch { return null; }
}


async function fetchCoachConversations(accessToken) {

  const data = await callSupabaseFunctionWithAuth("messages", { action: "conversations" }, accessToken);
  const convs = Array.isArray(data?.conversations) ? data.conversations : [];
  console.log("[DEBUG-MSG] fetchCoachConversations:", convs.length, "conversations.", convs.length ? "Dernier msg:" + convs[0]?.last_message + " unread:" + convs[0]?.unread : "");
  return convs;
}
async function fetchMessageThread({ accessToken, athleteId }) {
  const data = await callSupabaseFunctionWithAuth("messages", { action: "thread", athleteId }, accessToken);
  const msgs = Array.isArray(data?.messages) ? data.messages : [];
  const last = msgs[msgs.length - 1];
  console.log("[DEBUG-MSG] fetchMessageThread:", msgs.length, "messages.", last ? "Dernier: [" + last.sender + "] " + last.body?.slice(0, 40) + " @ " + last.created_at : "vide");
  return msgs;
}
async function sendBackendMessage({ accessToken, athleteId, body, kind = "text" }) {
  console.log("[DEBUG-MSG] sendBackendMessage called with:", { athleteId, body: body?.slice(0, 50), kind });
  const data = await callSupabaseFunctionWithAuth("messages", { action: "send", athleteId, body, kind }, accessToken);
  console.log("[DEBUG-MSG] sendBackendMessage response:", data?.success ? "OK id=" + data?.message?.id : "FAIL");
  return data?.message || null;
}
async function markMessagesRead({ accessToken, athleteId }) {
  return callSupabaseFunctionWithAuth("messages", { action: "mark-read", athleteId }, accessToken);
}
async function reactBackendMessage({ accessToken, messageId, reaction }) {
  const data = await callSupabaseFunctionWithAuth("messages", { action: "react", messageId, reaction }, accessToken);
  return data?.success;
}
async function editBackendMessage({ accessToken, messageId, body }) {
  const data = await callSupabaseFunctionWithAuth("messages", { action: "edit", messageId, body }, accessToken);
  return data?.success;
}
async function deleteBackendMessage({ accessToken, messageId }) {
  const data = await callSupabaseFunctionWithAuth("messages", { action: "delete", messageId }, accessToken);
  return data?.success;
}

// ===== Temps réel (Supabase Realtime / WebSocket) =====
let __hmRealtimeClient = null;
function getRealtimeClient() {
  if (!hasSupabaseConfig) return null;
  if (!__hmRealtimeClient) {
    __hmRealtimeClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return __hmRealtimeClient;
}
// S'abonne aux nouveaux messages. Retourne une fonction pour se désabonner.
// onDisconnect est appelé si le canal Realtime se déconnecte (reconnexion automatique possible).
function subscribeToMessagesChannel(accessToken, onInsert, onDisconnect) {
  const client = getRealtimeClient();
  if (!client || !accessToken) return () => {};
  try { client.realtime.setAuth(accessToken); } catch { /* ignore */ }
  const channel = client
    .channel(`hm-messages-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      try { onInsert(payload.new); } catch { /* ignore */ }
    })
    .subscribe((status) => {
      if ((status === "CLOSED" || status === "CHANNEL_ERROR") && typeof onDisconnect === "function") {
        try { onDisconnect(); } catch { /* ignore */ }
      }
    });
  return () => { try { client.removeChannel(channel); } catch { /* ignore */ } };
}
// Alias sans callback de déconnexion (rétro-compat).
function subscribeToMessages(accessToken, onInsert) {
  return subscribeToMessagesChannel(accessToken, onInsert, null);
}

async function callSupabaseFunction(functionName, payload) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey
  };

  if (typeof supabaseAnonKey === "string" && supabaseAnonKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiError = data?.error || data || {};
    const message = apiError.message || data.message || "SUPABASE_FUNCTION_FAILED";
    const error = new Error(message);
    error.code = apiError.code || data.code || "";
    error.status = response.status;
    error.expiresAt = apiError.expiresAt || data.expiresAt || "";
    error.retryAfterSeconds = apiError.retryAfterSeconds || data.retryAfterSeconds || 0;
    console.error(`[FN ERROR] ${functionName}`, response.status, error.code, message, data);
    throw error;
  }

  return data;
}

async function callSupabaseFunctionWithAuth(functionName, payload, accessToken) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  if (!accessToken) {
    throw new Error("SESSION_REQUIRED");
  }

  console.log(`[DEBUG] calling ${functionName}`, {
    tokenLength: accessToken.length,
    tokenStart: accessToken.slice(0, 25),
    tokenIsJwt: accessToken.startsWith("eyJ"),
    apikeyLength: supabaseAnonKey.length,
    apikeyStart: supabaseAnonKey.slice(0, 25)
  });

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiError = data?.error || data || {};
    const message = apiError.message || data.message || "SUPABASE_FUNCTION_FAILED";
    const error = new Error(message);
    error.code = apiError.code || data.code || "";
    error.status = response.status;
    throw error;
  }

  return data;
}

async function callSupabaseUserUpdate(accessToken, payload, options = {}) {
  if (!hasSupabaseConfig) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  const endpoint = new URL(`${supabaseUrl}/auth/v1/user`);
  if (options.redirectTo) {
    endpoint.searchParams.set("redirect_to", options.redirectTo);
  }

  const response = await fetch(endpoint.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.msg || data.error_description || data.message || "SUPABASE_REQUEST_FAILED";
    const error = new Error(message);
    error.code = data.code || data.error_code || "";
    throw error;
  }

  return data;
}

function AnimatedNumber({ value, duration = 1400, decimals = 0, suffix = "", className = "", testId }) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const startedRef = useRef(false);
  const targetRef = useRef(value);
  targetRef.current = Number.isFinite(Number(value)) ? Number(value) : 0;

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setDisplay(targetRef.current);
      setDone(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const from = 0;
            const to = targetRef.current;
            const tick = (now) => {
              const elapsed = now - start;
              const progress = Math.min(1, elapsed / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(from + (to - from) * eased);
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setDisplay(to);
                setDone(true);
              }
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [duration]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("fr-FR");

  return (
    <span
      ref={ref}
      data-testid={testId}
      className={`stat-counter ${done ? "stat-counter--complete" : ""} ${className}`.trim()}
    >
      {formatted}
      {suffix}
    </span>
  );
}

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const left = Math.random() * 100;
        const top = 60 + Math.random() * 40;
        const tx = (Math.random() - 0.5) * 80;
        const ty = -(80 + Math.random() * 200);
        const size = 4 + Math.random() * 6;
        const duration = 7 + Math.random() * 6;
        const delay = Math.random() * 8;
        const opacity = 0.35 + Math.random() * 0.45;
        return { i, left, top, tx, ty, size, duration, delay, opacity };
      }),
    [],
  );

  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.i}
          className="hero-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--particle-tx": `${p.tx}px`,
            "--particle-ty": `${p.ty}px`,
            "--particle-duration": `${p.duration}s`,
            "--particle-delay": `${p.delay}s`,
            "--particle-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SectionTitle({ chip, title, subtitle }) {
  return (
    <div>
      <p className="inline-flex rounded-full border border-brand-400/35 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-100">
        {chip}
      </p>
      <h2 className="mt-4 font-display text-3xl font-black text-white md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-slate-300">{subtitle}</p>
    </div>
  );
}

function CertificationMedia({ certTitle, certImages, isSlider, currentImageIndex, dotKeyPrefix }) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-brand-300/45 bg-slate-950/85 p-3 shadow-[0_18px_36px_rgba(15,118,110,0.28)]">
      {isSlider ? (
        <>
          <div className="relative h-[330px] w-full md:h-[430px]">
            {certImages.map((image, imageIndex) => (
              <img
                key={image}
                src={image}
                alt={certTitle}
                className={`absolute inset-0 h-full w-full rounded-xl object-contain transition-opacity duration-700 ${currentImageIndex === imageIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            {certImages.map((_, dotIndex) => (
              <span
                key={`${dotKeyPrefix}-${dotIndex}`}
                className={`cert-dot h-2.5 w-2.5 rounded-full border border-white/90 transition ${currentImageIndex === dotIndex
                    ? "cert-dot--active bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "bg-transparent"
                  }`}
              />
            ))}
          </div>
        </>
      ) : (
        <img src={certImages[0]} alt={certTitle} className="h-[330px] w-full rounded-xl object-contain md:h-[430px]" />
      )}
    </div>
  );
}

function CoachMessagesPage({ refreshSession, onToast, onUnreadChange, authInputClass, authSelectClass }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeName, setActiveName] = useState("");
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all"); // all | unread | read
  const [sort, setSort] = useState("recent"); // recent | old
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const threadEndRef = useRef(null);

  const getToken = async () => {
    try { const s = await refreshSession(); return s?.accessToken || ""; } catch { return ""; }
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("SESSION");
      const list = await fetchCoachConversations(token);
      setConversations(list);
      if (typeof onUnreadChange === "function") {
        onUnreadChange(list.reduce((sum, c) => sum + (Number(c.unread) || 0), 0));
      }
    } catch {
      /* silencieux : liste vide */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConversations(); /* eslint-disable-next-line */ }, []);

  // Quasi temps réel : rafraîchissement automatique (fil ouvert = 4 s, inbox = 8 s).
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await getToken();
      if (!token) return;
      if (activeId) {
        try {
          const msgs = await fetchMessageThread({ accessToken: token, athleteId: activeId });
          setThread((prev) => (prev.length !== msgs.length ? msgs : prev));
        } catch { /* ignore */ }
      } else {
        try {
          const list = await fetchCoachConversations(token);
          setConversations(list);
          if (typeof onUnreadChange === "function") {
            onUnreadChange(list.reduce((sum, c) => sum + (Number(c.unread) || 0), 0));
          }
        } catch { /* ignore */ }
      }
    }, activeId ? 2000 : 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [activeId]);

  useEffect(() => {
    if (threadEndRef.current) threadEndRef.current.scrollIntoView({ block: "end" });
  }, [thread, activeId]);

  const openConversation = async (conv) => {
    setActiveId(conv.athlete_id);
    setActiveName(conv.athlete_name);
    setThreadLoading(true);
    setThread([]);
    try {
      const token = await getToken();
      if (!token) throw new Error("SESSION");
      const msgs = await fetchMessageThread({ accessToken: token, athleteId: conv.athlete_id });
      setThread(msgs);
      // localement : cette conversation passe en « lu »
      setConversations((prev) => prev.map((c) => (c.athlete_id === conv.athlete_id ? { ...c, unread: 0 } : c)));
      if (typeof onUnreadChange === "function") {
        onUnreadChange((prev) => Math.max(0, (Number(prev) || 0) - (Number(conv.unread) || 0)));
      }
    } catch {
      if (typeof onToast === "function") onToast({ type: "error", text: "Impossible d'ouvrir la conversation." });
    } finally {
      setThreadLoading(false);
    }
  };

  const backToInbox = () => { setActiveId(null); setThread([]); loadConversations(); };

  const sendReply = async () => {
    const body = reply.trim();
    if (!body || !activeId) return;
    setSending(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("SESSION");
      const msg = await sendBackendMessage({ accessToken: token, athleteId: activeId, body, kind: "text" });
      if (msg) setThread((prev) => [...prev, msg]);
      setReply("");
      setConversations((prev) => prev.map((c) => (c.athlete_id === activeId ? { ...c, last_message: body, last_sender: "coach", last_at: new Date().toISOString() } : c)));
    } catch {
      if (typeof onToast === "function") onToast({ type: "error", text: "Échec de l'envoi. Réessaie." });
    } finally {
      setSending(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    const list = conversations.filter((c) => {
      if (q && !String(c.athlete_name || "").toLowerCase().includes(q)) return false;
      if (readFilter === "unread" && !(c.unread > 0)) return false;
      if (readFilter === "read" && c.unread > 0) return false;
      const ts = new Date(c.last_at).getTime();
      if (fromTs != null && Number.isFinite(ts) && ts < fromTs) return false;
      if (toTs != null && Number.isFinite(ts) && ts > toTs) return false;
      return true;
    });
    list.sort((a, b) => {
      const da = new Date(a.last_at).getTime();
      const db = new Date(b.last_at).getTime();
      return sort === "recent" ? db - da : da - db;
    });
    return list;
  }, [conversations, search, readFilter, sort, dateFrom, dateTo]);

  const fmtWhen = (iso) => {
    try { return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch { return ""; }
  };
  const preview = (c) => {
    const prefix = c.last_sender === "coach" ? "Vous : " : "";
    const body = c.last_kind && c.last_kind !== "text" ? `[${c.last_kind === "image" ? "Image" : c.last_kind === "voice" ? "Vocal" : "Fichier"}]` : c.last_message;
    return `${prefix}${body || ""}`;
  };
  const totalUnread = conversations.reduce((s, c) => s + (Number(c.unread) || 0), 0);
  const hasFilter = Boolean(search.trim() || dateFrom || dateTo || readFilter !== "all");

  // ---- Vue conversation ----
  if (activeId) {
    return (
      <article className="settings-card flex min-h-[60vh] flex-col">
        <div className="flex items-center gap-3 border-b border-slate-600/40 pb-3">
          <button type="button" onClick={backToInbox} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-500/60 text-slate-300 transition hover:border-brand-300 hover:text-brand-200" aria-label="Retour">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18 9 12l6-6" /></svg>
          </button>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand-300/40 bg-brand-500/10 text-xs font-black text-brand-200">
            {getInitials(activeName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-black text-white">{activeName}</p>
            <p className="text-[11px] text-slate-400">Conversation</p>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto py-3">
          {threadLoading ? (
            <p className="py-8 text-center text-sm text-slate-400">Chargement…</p>
          ) : thread.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Aucun message.</p>
          ) : (
            thread.map((m) => {
              const mine = m.sender === "coach";
              const body = m.kind && m.kind !== "text" ? `[${m.kind === "image" ? "Image" : m.kind === "voice" ? "Vocal" : "Fichier"}]` : m.body;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-brand-500 text-slate-950" : "bg-slate-800 text-slate-100"}`}>
                    <p className="whitespace-pre-wrap break-words">{body}</p>
                    <p className={`mt-1 text-[10px] ${mine ? "text-slate-900/60" : "text-slate-400"}`}>{fmtWhen(m.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={threadEndRef} />
        </div>

        <div className="mt-2 flex items-end gap-2 border-t border-slate-600/40 pt-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
            rows={1}
            placeholder="Écris ta réponse…"
            className={`${authInputClass} max-h-32 flex-1 resize-none`}
          />
          <button type="button" onClick={sendReply} disabled={sending || !reply.trim()} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "…" : "Envoyer"}
          </button>
        </div>
      </article>
    );
  }

  // ---- Vue inbox (liste des conversations) ----
  return (
    <article className="settings-card">
      <SettingsSectionHeader
        icon="comments"
        eyebrow="Messagerie"
        title="Messages des athlètes"
        action={(
          <button type="button" onClick={loadConversations} disabled={loading} className="rounded-xl border border-slate-500/60 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-brand-300 hover:text-brand-200 disabled:opacity-50">
            {loading ? "…" : "Rafraîchir"}
          </button>
        )}
      />

      {/* Filtres */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="block text-xs font-semibold text-slate-300 xl:col-span-1">
          <span>Statut</span>
          <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)} className={authSelectClass}>
            <option value="all">Tous</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </select>
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Trier</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={authSelectClass}>
            <option value="recent">Plus récent</option>
            <option value="old">Plus ancien</option>
          </select>
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Du</span>
          <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} className={authInputClass} />
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Au</span>
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className={authInputClass} />
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Nom / prénom</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className={authInputClass} />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span>{filtered.length} conversation{filtered.length > 1 ? "s" : ""}{totalUnread ? ` · ${totalUnread} non lu${totalUnread > 1 ? "s" : ""}` : ""}</span>
        {hasFilter ? (
          <button type="button" onClick={() => { setSearch(""); setReadFilter("all"); setDateFrom(""); setDateTo(""); }} className="font-bold text-brand-300 hover:text-brand-200">Réinitialiser les filtres</button>
        ) : null}
      </div>

      {/* Liste */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-6 text-center text-sm text-slate-300">Chargement…</p>
        ) : conversations.length === 0 ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-6 text-center text-sm text-slate-300">Aucun message reçu pour le moment.</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-6 text-center text-sm text-slate-300">Aucune conversation ne correspond à ces filtres.</p>
        ) : (
          filtered.map((c) => {
            const unread = c.unread > 0;
            return (
              <button
                key={c.athlete_id}
                type="button"
                onClick={() => openConversation(c)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${unread ? "border-brand-300/50 bg-brand-500/5" : "border-slate-600/60 bg-slate-950/40"} hover:border-brand-300`}
              >
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-300/40 bg-brand-500/10 text-sm font-black text-brand-200">
                    {c.athlete_avatar ? <img src={c.athlete_avatar} alt="" className="h-full w-full object-cover" /> : <span>{getInitials(c.athlete_name)}</span>}
                  </div>
                  {unread ? <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-slate-950 bg-red-500" aria-label="Non lu" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate ${unread ? "font-black text-white" : "font-bold text-slate-200"}`}>{c.athlete_name}</p>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-400">{fmtWhen(c.last_at)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-xs ${unread ? "text-slate-200" : "text-slate-400"}`}>{preview(c)}</p>
                    {unread ? <span className="shrink-0 rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">{c.unread}</span> : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </article>
  );
}

function CoachReviewsPage({ reviews, onChanged, refreshSession, onToast, authInputClass, authSelectClass }) {
  const [sort, setSort] = useState("recent"); // recent | old
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [busy, setBusy] = useState(false);

  const toggleSelect = (id) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const exitSelect = () => { setSelectMode(false); setSelected(new Set()); };
  const resetFilters = () => { setSort("recent"); setDateFrom(""); setDateTo(""); setNameQuery(""); };

  const filtered = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    const list = (Array.isArray(reviews) ? reviews : []).filter((r) => {
      if (q && !String(r.authorName || "").toLowerCase().includes(q)) return false;
      const ts = new Date(r.createdAt).getTime();
      if (fromTs != null && Number.isFinite(ts) && ts < fromTs) return false;
      if (toTs != null && Number.isFinite(ts) && ts > toTs) return false;
      return true;
    });
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "recent" ? db - da : da - db;
    });
    return list;
  }, [reviews, nameQuery, dateFrom, dateTo, sort]);

  const total = Array.isArray(reviews) ? reviews.length : 0;
  const hasFilter = Boolean(nameQuery.trim() || dateFrom || dateTo);

  const runDelete = async (opts, successText) => {
    setBusy(true);
    try {
      let token = "";
      try { const s = await refreshSession(); token = s?.accessToken || ""; } catch { /* ignore */ }
      if (!token) throw new Error("SESSION_REQUIRED");
      try {
        await deleteCoachClientReviews({ accessToken: token, ...opts });
      } catch (firstErr) {
        // Auto-réparation : coach pas encore reconnu côté serveur → on pose le marqueur puis on réessaie.
        if (firstErr?.status === 403 || firstErr?.code === "FORBIDDEN") {
          try {
            await callSupabaseFunctionWithAuth("update-account-security", { metadata: { is_coach: true } }, token);
          } catch { /* ignore : le marqueur est déjà posé */ }
          await deleteCoachClientReviews({ accessToken: token, ...opts });
        } else {
          throw firstErr;
        }
      }
      if (opts.all) onChanged([]);
      else onChanged((prev) => prev.filter((r) => !opts.reviewIds.includes(r.id)));
      exitSelect();
      if (typeof onToast === "function") onToast({ type: "success", text: successText });
    } catch {
      if (typeof onToast === "function") onToast({ type: "error", text: "Échec de la suppression. Réessaie." });
    } finally {
      setBusy(false);
    }
  };
  const deleteOne = (id) => runDelete({ reviewIds: [id] }, "Commentaire supprimé ✓");
  const deleteSelected = () => runDelete({ reviewIds: [...selected] }, "Commentaires supprimés ✓");
  const deleteAll = () => runDelete({ all: true }, "Tous les commentaires ont été supprimés ✓");

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  return (
    <article className="settings-card">
      <SettingsSectionHeader
        icon="comments"
        eyebrow="Modération"
        title="Commentaires des athlètes"
        action={(
          <div className="flex flex-wrap items-center gap-2">
            {selectMode ? (
              <>
                <button type="button" onClick={deleteSelected} disabled={busy || selected.size === 0} className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Supprimer la sélection{selected.size ? ` (${selected.size})` : ""}
                </button>
                <button type="button" onClick={exitSelect} disabled={busy} className="rounded-xl border border-slate-500/60 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-brand-300 hover:text-brand-200">
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={deleteAll} disabled={busy || total === 0} className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Tout supprimer
                </button>
                <button type="button" onClick={() => setSelectMode(true)} disabled={busy || filtered.length === 0} className="rounded-xl border border-slate-500/60 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-brand-300 hover:text-brand-200 disabled:cursor-not-allowed disabled:opacity-50">
                  Sélectionner
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* Filtres */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block text-xs font-semibold text-slate-300">
          <span>Trier</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={authSelectClass}>
            <option value="recent">Plus récent</option>
            <option value="old">Plus ancien</option>
          </select>
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Du</span>
          <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} className={authInputClass} />
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Au</span>
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className={authInputClass} />
        </label>
        <label className="block text-xs font-semibold text-slate-300">
          <span>Nom / prénom de l'athlète</span>
          <input type="text" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="Rechercher un athlète…" className={authInputClass} />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span>{filtered.length} affiché{filtered.length > 1 ? "s" : ""} / {total} au total</span>
        {hasFilter ? (
          <button type="button" onClick={resetFilters} className="font-bold text-brand-300 hover:text-brand-200">Réinitialiser les filtres</button>
        ) : null}
      </div>

      {/* Liste */}
      <div className="mt-4 space-y-3">
        {total === 0 ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-6 text-center text-sm text-slate-300">Aucun commentaire pour le moment.</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-6 text-center text-sm text-slate-300">Aucun commentaire ne correspond à ces filtres.</p>
        ) : null}

        {filtered.map((r) => {
          const initials = getInitials(r.authorName);
          return (
            <div key={r.id} className="flex items-start gap-3 rounded-xl border border-slate-600/60 bg-slate-950/40 p-3">
              {selectMode ? (
                <label className="flex shrink-0 cursor-pointer items-center pt-1">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="h-5 w-5 cursor-pointer accent-brand-500" />
                </label>
              ) : null}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-300/40 bg-brand-500/10 text-xs font-black text-brand-200">
                {r.avatarUrl ? <img src={r.avatarUrl} alt="" className="h-full w-full object-cover" /> : <span>{initials}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate font-black text-white">{r.authorName}</p>
                  <span className="text-[11px] font-semibold text-slate-400">{fmtDate(r.createdAt)}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-0.5" aria-label={`Note ${r.rating}/5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${n <= r.rating ? "text-brand-300" : "text-slate-600"}`} fill="currentColor" aria-hidden="true">
                      <path d="M12 2.6 14.4 8l5.9.5-4.45 3.9 1.35 5.8L12 15.15 6.8 18.2l1.35-5.8L3.7 8.5 9.6 8 12 2.6Z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-1.5 break-words text-sm text-slate-200">{r.message}</p>
              </div>
              {!selectMode ? (
                <button type="button" onClick={() => deleteOne(r.id)} disabled={busy} className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-400/60 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
                  <span className="hidden sm:inline">Suppr.</span>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function CoachContactsEditor({ contacts, onSaved, onToast, refreshSession, authInputClass, authSelectClass }) {
  const kindLabels = {
    facebook: "Facebook",
    tiktok: "TikTok",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    youtube: "YouTube",
    phone: "Téléphone",
    email: "Email",
    website: "Site web",
    custom: "Autre"
  };
  // On reflète EXACTEMENT la base : si le coach supprime tout, l'éditeur reste vide (pas de retour
  // des valeurs par défaut). La base est l'unique source de vérité.
  const mirror = (list) => (Array.isArray(list) ? list : []).map((c) => ({ ...c }));
  const [draft, setDraft] = useState(() => mirror(contacts));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  // Tant que le coach n'a rien modifié, on reflète la dernière liste enregistrée en base
  // (rechargée après (re)connexion). On n'écrase jamais des modifications en cours.
  const dirtyRef = useRef(false);
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(mirror(contacts));
  }, [contacts]);

  const updateRow = (i, patch) => { dirtyRef.current = true; setDraft((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r))); };
  const removeRow = (i) => { dirtyRef.current = true; setDraft((rows) => rows.filter((_, idx) => idx !== i)); };
  const addRow = () => { dirtyRef.current = true; setDraft((rows) => [...rows, { kind: "custom", label: "", value: "" }]); };

  // Sélection multiple pour supprimer rapidement plusieurs réseaux.
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const toggleSelect = (i) =>
    setSelected((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const exitSelect = () => { setSelectMode(false); setSelected(new Set()); };
  const deleteAll = () => { dirtyRef.current = true; setDraft([]); exitSelect(); };
  const deleteSelected = () => {
    dirtyRef.current = true;
    setDraft((rows) => rows.filter((_, idx) => !selected.has(idx)));
    exitSelect();
  };

  const save = async () => {
    const cleaned = draft
      .map((r, i) => ({ kind: r.kind || "custom", label: String(r.label || "").trim(), value: String(r.value || "").trim(), sort_order: i }))
      .filter((r) => r.value);
    setSaving(true);
    setFeedback({ type: "", text: "" });
    try {
      let token = "";
      try {
        const s = await refreshSession();
        token = s?.accessToken || "";
      } catch {
        /* ignore */
      }
      if (!token) throw new Error("SESSION_REQUIRED");
      let data;
      try {
        data = await callSupabaseFunctionWithAuth("site-contacts", { action: "save", contacts: cleaned }, token);
      } catch (firstErr) {
        // Auto-réparation : compte coach pas encore reconnu côté serveur (email changé) → on pose le
        // marqueur is_coach puis on réessaie une fois.
        if (firstErr?.status === 403 || firstErr?.code === "FORBIDDEN") {
          // Le marqueur is_coach est écrit côté serveur même si la fonction renvoie une erreur ensuite :
          // on ignore son résultat et on réessaie l'enregistrement.
          try {
            await callSupabaseFunctionWithAuth("update-account-security", { metadata: { is_coach: true } }, token);
          } catch { /* ignore : le marqueur est déjà posé */ }
          data = await callSupabaseFunctionWithAuth("site-contacts", { action: "save", contacts: cleaned }, token);
        } else {
          throw firstErr;
        }
      }
      const list = Array.isArray(data?.contacts) ? data.contacts : cleaned;
      if (typeof onSaved === "function") onSaved(list);
      dirtyRef.current = false;
      setDraft(list.map((c) => ({ ...c })));
      setFeedback({ type: "", text: "" });
      if (typeof onToast === "function") {
        onToast({ type: "success", text: "Contacts enregistrés ✓" });
      }
    } catch (err) {
      const status = err?.status ? ` (${err.status})` : "";
      const detail =
        err?.code === "FORBIDDEN" || err?.status === 403
          ? "Action réservée au coach : ton compte n'est pas reconnu comme coach côté serveur."
          : err?.code === "AUTH_REQUIRED" || err?.status === 401
            ? "Session non reconnue. Reconnecte-toi puis réessaie."
            : String(err?.message || "Erreur inconnue");
      setFeedback({ type: "error", text: `Échec de l'enregistrement${status} : ${detail}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="settings-card">
      <SettingsSectionHeader
        icon="contact"
        eyebrow="Visible par tous"
        title="Réseaux & contacts"
        action={(
          <div className="flex flex-wrap items-center gap-2">
            {selectMode ? (
              <>
                <button type="button" onClick={deleteSelected} disabled={selected.size === 0} className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Supprimer la sélection{selected.size ? ` (${selected.size})` : ""}
                </button>
                <button type="button" onClick={exitSelect} className="rounded-xl border border-slate-500/60 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-brand-300 hover:text-brand-200">
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={deleteAll} disabled={draft.length === 0} className="rounded-xl border border-red-400/60 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                  Tout supprimer
                </button>
                <button type="button" onClick={() => setSelectMode(true)} disabled={draft.length === 0} className="rounded-xl border border-slate-500/60 px-3 py-1.5 text-xs font-black text-slate-300 transition hover:border-brand-300 hover:text-brand-200 disabled:cursor-not-allowed disabled:opacity-50">
                  Sélectionner
                </button>
              </>
            )}
            <button type="button" onClick={addRow} className="rounded-xl border border-brand-300/60 bg-brand-500/10 px-3 py-1.5 text-xs font-black text-brand-200 transition hover:bg-brand-500/20">
              + Ajouter
            </button>
          </div>
        )}
      />
      <div className="mt-4 space-y-3">
        {draft.length === 0 ? (
          <p className="rounded-xl border border-slate-600/60 bg-slate-950/40 px-3 py-3 text-sm text-slate-300">Aucun contact. Clique sur « + Ajouter ».</p>
        ) : null}
        {draft.map((row, i) => (
          <div key={i} className="flex items-stretch gap-2">
            {selectMode ? (
              <label className="flex shrink-0 cursor-pointer items-center px-1">
                <input type="checkbox" checked={selected.has(i)} onChange={() => toggleSelect(i)} className="h-5 w-5 cursor-pointer accent-brand-500" />
              </label>
            ) : null}
          <div className="grid flex-1 grid-cols-1 gap-2 rounded-xl border border-slate-600/60 bg-slate-950/40 p-3 sm:grid-cols-[minmax(11rem,17rem)_1fr_auto] sm:items-stretch">
            {row.kind === "custom" ? (
              <div className="profile-other-combo" style={{ marginTop: 0 }}>
                <select value={row.kind} onChange={(e) => updateRow(i, { kind: e.target.value })} className="profile-other-combo__select">
                  {CONTACT_KINDS.map((k) => (
                    <option key={k} value={k}>{kindLabels[k] || k}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                  className="profile-other-combo__input"
                  placeholder="Hicham Mechekour"
                />
              </div>
            ) : (
              <select value={row.kind} onChange={(e) => updateRow(i, { kind: e.target.value })} className={authSelectClass}>
                {CONTACT_KINDS.map((k) => (
                  <option key={k} value={k}>{kindLabels[k] || k}</option>
                ))}
              </select>
            )}
            {row.kind === "custom" ? (
              <input value={row.value} onChange={(e) => updateRow(i, { value: e.target.value })} placeholder="Lien / numéro / email" className={authInputClass} />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={row.label}
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                  disabled={row.kind === "phone" || row.kind === "whatsapp"}
                  placeholder="Hicham Mechekour"
                  className={`${authInputClass} ${row.kind === "phone" || row.kind === "whatsapp" ? "cursor-not-allowed opacity-60" : ""}`}
                />
                <input value={row.value} onChange={(e) => updateRow(i, { value: e.target.value })} placeholder="Lien / numéro / email" className={authInputClass} />
              </div>
            )}
            <button type="button" onClick={() => removeRow(i)} className="mt-1.5 flex items-center justify-center gap-1.5 self-stretch rounded-lg border border-red-400/60 bg-red-500/10 px-3 text-xs font-black text-red-300 transition hover:bg-red-500/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
              Suppr.
            </button>
          </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer les contacts"}
        </button>
        {feedback.text ? (
          <span className={`text-xs font-bold ${feedback.type === "success" ? "text-brand-300" : "text-red-400"}`}>{feedback.text}</span>
        ) : null}
      </div>
    </article>
  );
}

export default function App() {
  const heroImages = [coachHero, coachHeroAlt];
  const cvDownloadHref = "/cv.pdf";
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeIfbbSlide, setActiveIfbbSlide] = useState(0);
  const [activeNavSection, setActiveNavSection] = useState("services");
  const [language, setLanguage] = useState(() => {
    try {
      const saved = window.localStorage.getItem("hm-language");
      return saved && portfolioData[saved] ? saved : "fr";
    } catch {
      return "fr";
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("hm-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });
  const [activeNavKey, setActiveNavKey] = useState(() => {
    try {
      if ((window.location.pathname || "") !== "/dashboard") return "dashboard";
      const view = new URLSearchParams(window.location.search || "").get("view") || "dashboard";
      return dashboardNavKeys.has(view) ? view : "dashboard";
    } catch {
      return "dashboard";
    }
  });
  const [dashCancelOpen, setDashCancelOpen] = useState(false);
  // Notification « Coach Hicham vous a envoyé un programme » (payant ou gratuit).
  // Résumé au premier chargement, puis une notif par nouveau programme ajouté ensuite.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = "hm-programs-notified";
      const saved = window.localStorage.getItem(key);
      const known = new Set(saved ? JSON.parse(saved) : []);
      const currentIds = coachPrograms.map((p) => p.id);
      const newIds = currentIds.filter((id) => !known.has(id));
      if (newIds.length) {
        if (known.size === 0) {
          addShopNotification(
            `Coach Hicham vous a envoyé ${newIds.length} programme${newIds.length > 1 ? "s" : ""}. Retrouvez-${newIds.length > 1 ? "les" : "le"} dans « Mes programmes ».`
          );
        } else {
          newIds.forEach((id) => {
            const p = coachPrograms.find((x) => x.id === id);
            if (p) addShopNotification(`Coach Hicham vous a envoyé le programme « ${p.name} » (${p.priceType}).`);
          });
        }
        window.localStorage.setItem(key, JSON.stringify(currentIds));
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [contactForm, setContactForm] = useState({
    message: "",
    rating: 0
  });
  const [editingReviewId, setEditingReviewId] = useState("");
  const [highlightedReviewId, setHighlightedReviewId] = useState("");
  const [reviewPage, setReviewPage] = useState(0);
  const [clientReviews, setClientReviews] = useState([]);
  const [athleteCount, setAthleteCount] = useState(null);
  const [isReviewSaving, setIsReviewSaving] = useState(false);
  const [sendFeedback, setSendFeedback] = useState({ type: "", text: "" });
  const [authMode, setAuthMode] = useState("login");
  const [registerStep, setRegisterStep] = useState(1);
  const [registerPersonalValidated, setRegisterPersonalValidated] = useState(false);
  const [authForm, setAuthForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    sex: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [authFeedback, setAuthFeedback] = useState({ type: "", text: "" });
  const [resetVerificationCode, setResetVerificationCode] = useState("");
  const [signupPendingEmail, setSignupPendingEmail] = useState(() => {
    try {
      return window.localStorage.getItem("hm-signup-pending") || "";
    } catch {
      return "";
    }
  });
  const [pendingMailboxEmail, setPendingMailboxEmail] = useState(() => {
    try {
      return window.localStorage.getItem("hm-auth-mailbox-email") || "";
    } catch {
      return "";
    }
  });
  const [pendingMailboxIntent, setPendingMailboxIntent] = useState(() => {
    try {
      return window.localStorage.getItem("hm-auth-mailbox-intent") || "signup";
    } catch {
      return "signup";
    }
  });
  const [resetAccessToken, setResetAccessToken] = useState(() => {
    try {
      return (
        window.sessionStorage.getItem("hm-reset-access-token") ||
        window.localStorage.getItem("hm-reset-access-token") ||
        ""
      );
    } catch {
      return "";
    }
  });
  const [resetExpiresAt, setResetExpiresAt] = useState(() => {
    try {
      return Number(
        window.sessionStorage.getItem("hm-reset-expires-at") ||
        window.localStorage.getItem("hm-reset-expires-at") ||
        0
      );
    } catch {
      return 0;
    }
  });
  const [resetRequestedAt, setResetRequestedAt] = useState(() => {
    try {
      return Number(window.localStorage.getItem("hm-reset-requested-at") || 0);
    } catch {
      return 0;
    }
  });
  const [resetCodeSecondsLeft, setResetCodeSecondsLeft] = useState(0);
  const [resetSecondsLeft, setResetSecondsLeft] = useState(0);
  const [isResetValidationReady, setIsResetValidationReady] = useState(false);
  const [showAuthConfirmation, setShowAuthConfirmation] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const isLoginConfirmationRoute =
        (window.location.pathname || "/") === "/auth" &&
        params.get("mode") === "login" &&
        params.get("form") !== "1";
      return isLoginConfirmationRoute && Boolean(window.localStorage.getItem("hm-signup-pending"));
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = window.localStorage.getItem("hm-current-user");
      const parsedUser = saved ? JSON.parse(saved) : null;
      if (!parsedUser) return null;

      return {
        ...parsedUser,
        accessToken: window.sessionStorage.getItem("hm-access-token") || parsedUser.accessToken || "",
        refreshToken: window.sessionStorage.getItem("hm-refresh-token") || parsedUser.refreshToken || ""
      };
    } catch {
      return null;
    }
  });
  const [sportProfile, setSportProfile] = useState(() => {
    try {
      const saved = window.localStorage.getItem("hm-sport-profile");
      return saved ? normalizeSportProfile(JSON.parse(saved)) : normalizeSportProfile();
    } catch {
      return normalizeSportProfile();
    }
  });
  const [sportProfileForm, setSportProfileForm] = useState(() => sportProfileToForm(sportProfile));
  const [sportProfileFeedback, setSportProfileFeedback] = useState({ type: "", text: "" });
  const [isSportProfileSaving, setIsSportProfileSaving] = useState(false);
  const [isSportProfileLoading, setIsSportProfileLoading] = useState(false);
  const [settingsForm, setSettingsForm] = useState(emptySettingsForm);
  const [settingsFeedback, setSettingsFeedback] = useState({ type: "", text: "" });
  const [appToast, setAppToast] = useState({ type: "", text: "" });
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [dashboardWeightRange, setDashboardWeightRange] = useState("week");
  const [shopSearch, setShopSearch] = useState("");
  const [shopCategory, setShopCategory] = useState("Tous");
  const [shopPriceType, setShopPriceType] = useState("Tous");
  const [isGlobalCartOpen, setIsGlobalCartOpen] = useState(false);
  const globalCartItems = useMemo(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("hm-shop-cart") : null;
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((entry) => {
        const id = typeof entry === "string" ? entry : entry?.id;
        const product = shopProducts.find((p) => p.id === id);
        return product ? { ...product, priceValue: parseProductPrice(product.price) } : null;
      }).filter(Boolean);
    } catch { return []; }
  }, [isGlobalCartOpen]);
  const globalCartTotal = globalCartItems.reduce((s, i) => s + (i.priceValue || 0), 0);
  const removeFromGlobalCart = (productId) => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("hm-shop-cart") : "[]";
      const parsed = JSON.parse(saved || "[]").filter((e) => (typeof e === "string" ? e : e?.id) !== productId);
      window.localStorage.setItem("hm-shop-cart", JSON.stringify(parsed));
      setIsGlobalCartOpen((v) => v); // force re-render
    } catch { /* ignore */ }
  };
  // Paiement DIRECT depuis le panier global (sans passer par la page Boutique).
  // L'utilisateur réside-t-il en Algérie ? (code pays ISO « DZ »). Si oui, on lui propose le choix
  // entre le paiement carte (Stripe/PayPal) et le paiement local CCP / EDAHABIA (Chargily).
  const isAlgeriaResident = String(currentUser?.country || "").toUpperCase() === "DZ";
  // État de la fenêtre de choix du moyen de paiement (Algérie uniquement).
  const [paymentChoice, setPaymentChoice] = useState({ open: false, items: [], returnTo: "shop" });

  // Récupère un jeton FRAIS juste avant de payer (évite « Session requise » si le jeton est expiré).
  const getPaymentToken = async () => {
    let token = "";
    try { const fresh = await refreshCurrentUserSession(); token = fresh?.accessToken || ""; } catch { /* fallback */ }
    if (!token) token = (typeof window !== "undefined" ? window.sessionStorage.getItem("hm-access-token") : "") || "";
    return token;
  };

  // Paiement carte/PayPal via Stripe (hosted Checkout).
  const runStripeCheckout = async (paidIds, returnTo = "shop") => {
    if (!paidIds?.length) return;
    const token = await getPaymentToken();
    if (!token) {
      setAppToast({ type: "error", text: "Session expirée — reconnecte-toi pour payer." });
      return;
    }
    try {
      const result = await callSupabaseFunctionWithAuth("create-checkout-session", { items: paidIds, returnTo }, token);
      if (result?.url) {
        window.location.href = result.url;
      } else {
        setAppToast({ type: "error", text: "Impossible de démarrer le paiement. Réessaie." });
      }
    } catch (error) {
      setAppToast({ type: "error", text: `Impossible de démarrer le paiement : ${error?.message || error?.code || "erreur inconnue"}` });
    }
  };

  // Paiement local CCP / EDAHABIA via Chargily (Algérie).
  const runChargilyCheckout = async (paidIds, returnTo = "shop") => {
    if (!paidIds?.length) return;
    const token = await getPaymentToken();
    if (!token) {
      setAppToast({ type: "error", text: "Session expirée — reconnecte-toi pour payer." });
      return;
    }
    try {
      const result = await callSupabaseFunctionWithAuth("create-chargily-checkout", { items: paidIds, returnTo }, token);
      if (result?.url) {
        // On mémorise l'id du paiement pour le vérifier au retour.
        try {
          window.localStorage.setItem("hm-chargily-pending", JSON.stringify({ checkoutId: result.checkoutId, returnTo }));
        } catch { /* ignore */ }
        window.location.href = result.url;
      } else {
        setAppToast({ type: "error", text: "Impossible de démarrer le paiement CCP. Réessaie." });
      }
    } catch (error) {
      setAppToast({ type: "error", text: `Impossible de démarrer le paiement CCP : ${error?.message || error?.code || "erreur inconnue"}` });
    }
  };

  // Point d'entrée unique du paiement : en Algérie, on ouvre le choix Stripe/Chargily ; sinon Stripe direct.
  const startPaidCheckout = (paidIds, returnTo = "shop") => {
    if (!paidIds?.length) return;
    if (isAlgeriaResident) {
      setPaymentChoice({ open: true, items: paidIds, returnTo });
    } else {
      runStripeCheckout(paidIds, returnTo);
    }
  };

  const handleGlobalCheckout = async () => {
    const paidIds = globalCartItems.filter((i) => i.priceValue != null && i.priceValue > 0).map((i) => i.id);
    const freeIds = globalCartItems.filter((i) => i.priceValue == null || i.priceValue <= 0).map((i) => i.id);
    if (freeIds.length) {
      try {
        const saved = window.localStorage.getItem("hm-shop-purchased");
        const parsed = saved ? JSON.parse(saved) : [];
        const next = Array.from(new Set([...(Array.isArray(parsed) ? parsed : []), ...freeIds]));
        window.localStorage.setItem("hm-shop-purchased", JSON.stringify(next));
      } catch { /* ignore */ }
    }
    if (!paidIds.length) {
      try { window.localStorage.setItem("hm-shop-cart", JSON.stringify([])); } catch { /* ignore */ }
      setIsGlobalCartOpen(false);
      setAppToast({ type: "success", text: "Produits gratuits débloqués." });
      return;
    }
    setIsGlobalCartOpen(false);
    startPaidCheckout(paidIds, "shop");
  };
  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      return {
        path: window.location.pathname || "/",
        search: window.location.search || ""
      };
    } catch {
      return {
        path: "/",
        search: ""
      };
    }
  });

  const content = portfolioData[language] || portfolioData.fr;
  const isArabic = language === "ar";
  const isLight = theme === "light";
  const displayLocale = language === "en" ? "en" : language === "ar" ? "ar" : "fr";
  const isAuthPage = currentRoute.path === "/auth";
  const isCompleteProfilePage = currentRoute.path === "/complete-profile";
  const isDashboardPage = currentRoute.path === "/dashboard";
  const isHomePage = currentRoute.path === "/";
  const isCoachAccount = isCoachUser(currentUser);
  // Dès qu'on voit l'email du coach, on mémorise son identifiant (pour le garder reconnu après un changement d'email).
  useEffect(() => {
    if (isCoachEmail(currentUser?.email) && currentUser?.id) rememberCoachUid(currentUser.id);
  }, [currentUser?.email, currentUser?.id]);
  // Marque le compte comme coach côté serveur (is_coach) une seule fois : autorise l'enregistrement
  // des contacts même si le coach a changé son email.
  const coachFlaggedRef = useRef(false);
  useEffect(() => {
    if (!isCoachAccount || !currentUser?.id || coachFlaggedRef.current) return;
    let flagged = "";
    try { flagged = window.localStorage.getItem("hm-coach-flagged") || ""; } catch { /* ignore */ }
    if (flagged === currentUser.id) { coachFlaggedRef.current = true; return; }
    coachFlaggedRef.current = true;
    (async () => {
      try {
        const s = await refreshCurrentUserSession();
        if (!s?.accessToken) { coachFlaggedRef.current = false; return; }
        await callSupabaseFunctionWithAuth("update-account-security", { metadata: { is_coach: true } }, s.accessToken);
        try { window.localStorage.setItem("hm-coach-flagged", currentUser.id); } catch { /* ignore */ }
      } catch {
        coachFlaggedRef.current = false; // on réessaiera au prochain chargement
      }
    })();
  }, [isCoachAccount, currentUser?.id]);
  // Compteur de messages non lus (pastille rouge du menu Messagerie), chargé quand le coach est connecté.
  // Le chat (CoachInbox) accède à la session via ce fournisseur global — tenu à jour à chaque rendu.
  useEffect(() => { setHmSessionGetter(refreshCurrentUserSession); setHmIsCoach(isCoachAccount); });
  // Le coach arrive d'abord sur la page Paramètres (une seule fois, sans forcer la navigation ensuite).
  const coachLandedRef = useRef(false);
  useEffect(() => {
    if (isCoachAccount && isDashboardPage && !coachLandedRef.current) {
      coachLandedRef.current = true;
      const view = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("view");
      if (!view || view === "dashboard") {
        setActiveNavKey("settings");
      }
    }
    if (!isCoachAccount) coachLandedRef.current = false;
  }, [isCoachAccount, isDashboardPage]);

  // Contacts du footer : la base est la source de vérité. On reflète EXACTEMENT ce qui y est enregistré
  // (une liste vide reste vide → une suppression est définitive et ne « revient » jamais).
  const [siteContacts, setSiteContacts] = useState(DEFAULT_SITE_CONTACTS);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await callSupabaseFunction("site-contacts", { action: "list" });
        const list = Array.isArray(data?.contacts) ? data.contacts : [];
        if (!cancelled) setSiteContacts(list);
      } catch {
        // Fonction indisponible : on garde les valeurs par défaut à l'écran.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  // Coach : pays de résidence par défaut = Algérie (s'il n'en a pas encore choisi un).
  useEffect(() => {
    if (isCoachAccount && !settingsForm.country) {
      setSettingsForm((prev) => (prev.country ? prev : { ...prev, country: "DZ", phoneCountryCode: getCountryDialCode("DZ") }));
    }
  }, [isCoachAccount, settingsForm.country]);
  const [dashboardNow, setDashboardNow] = useState(() => new Date());
  useEffect(() => {
    if (!isDashboardPage) return undefined;
    const id = setInterval(() => setDashboardNow(new Date()), 30000);
    return () => clearInterval(id);
  }, [isDashboardPage]);
  const authSearchParams = new URLSearchParams(currentRoute.search);
  const authModeQuery = authSearchParams.get("mode");
  const authFormQuery = authSearchParams.get("form");
  const isConfirmedAccountPage = authSearchParams.get("confirmed") === "1";
  const isAuthCheckEmailPage = isAuthPage && authModeQuery === "check-email";
  const isAuthResetCodePage = isAuthPage && authModeQuery === "reset-code";
  const isAuthResetPage = isAuthPage && authModeQuery === "reset";
  const isAuthConfirmationPage =
    isAuthPage && authModeQuery === "login" && authFormQuery !== "1" && (showAuthConfirmation || isConfirmedAccountPage);
  const currentLanguageOption = languageOptions[language] || languageOptions.fr;
  const authText = content.contact.auth;
  const profileText = content.sportsProfile || portfolioData.fr.sportsProfile;
  const countryOptions = getCountryOptions(language);
  const passwordChecks = getPasswordChecks(authForm.password);
  const settingsPasswordChecks = getPasswordChecks(settingsForm.newPassword);
  const registerBirthDateIsAdult = !authForm.birthDate || isAdultBirthDate(authForm.birthDate);
  const registerBirthDateError = Boolean(authForm.birthDate && !registerBirthDateIsAdult);
  const registerPersonalComplete = Boolean(
    authForm.firstName.trim() &&
    authForm.lastName.trim() &&
    authForm.birthDate &&
    registerBirthDateIsAdult &&
    authForm.sex &&
    authForm.country
  );
  const registerConnectionComplete = Boolean(
    authForm.email.trim() &&
    authForm.password &&
    authForm.confirmPassword &&
    isPasswordStrong(authForm.password) &&
    authForm.password === authForm.confirmPassword
  );
  const signupStepsText = authText.signupSteps || {};
  const storedResetAccessToken = (() => {
    try {
      return (
        window.sessionStorage.getItem("hm-reset-access-token") ||
        window.localStorage.getItem("hm-reset-access-token") ||
        ""
      );
    } catch {
      return "";
    }
  })();
  const storedResetExpiresAt = (() => {
    try {
      return Number(
        window.sessionStorage.getItem("hm-reset-expires-at") ||
        window.localStorage.getItem("hm-reset-expires-at") ||
        0
      );
    } catch {
      return 0;
    }
  })();
  const storedResetRequestedAt = (() => {
    try {
      return Number(window.localStorage.getItem("hm-reset-requested-at") || 0);
    } catch {
      return 0;
    }
  })();
  const effectiveResetAccessToken = resetAccessToken || storedResetAccessToken;
  const latestResetRequestedAt = Math.max(resetRequestedAt, storedResetRequestedAt);
  const effectiveResetRequestedAt = latestResetRequestedAt ? Math.min(latestResetRequestedAt, Date.now()) : 0;
  const effectiveResetCodeExpiresAt = effectiveResetRequestedAt ? effectiveResetRequestedAt + resetLinkLifetimeMs : 0;
  const effectiveResetExpiresAt = Math.max(
    resetExpiresAt,
    storedResetExpiresAt,
    effectiveResetRequestedAt ? effectiveResetRequestedAt + resetLinkLifetimeMs : 0
  );
  const resetCodeCountdownLabel = formatAuthSeconds(resetCodeSecondsLeft);
  const resetCountdownLabel = formatAuthSeconds(resetSecondsLeft);
  const resetPageIsValid = Boolean(
    effectiveResetAccessToken && effectiveResetExpiresAt && effectiveResetExpiresAt > Date.now()
  );
  const sportProfileComplete = isSportProfileComplete(sportProfile);
  const sortedClientReviews = [...clientReviews].sort((firstReview, secondReview) => {
    const firstIsMine = currentUser?.id && firstReview.authorId === currentUser.id ? 1 : 0;
    const secondIsMine = currentUser?.id && secondReview.authorId === currentUser.id ? 1 : 0;
    if (firstIsMine !== secondIsMine) return secondIsMine - firstIsMine;
    return new Date(secondReview.createdAt).getTime() - new Date(firstReview.createdAt).getTime();
  });
  const currentUserReview = currentUser?.id
    ? sortedClientReviews.find((review) => review.authorId === currentUser.id) || null
    : null;
  // Si l'athlète a déjà un avis, on pré-remplit automatiquement le formulaire (message + note).
  const currentUserReviewId = currentUserReview?.id || "";
  useEffect(() => {
    if (currentUserReview) {
      setEditingReviewId(currentUserReview.id);
      setContactForm({ message: currentUserReview.message, rating: currentUserReview.rating });
    } else {
      setEditingReviewId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserReviewId]);
  const clientReviewCount = clientReviews.length;
  const averageClientRating = clientReviewCount
    ? clientReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / clientReviewCount
    : 0;
  const averageClientRatingLabel = clientReviewCount ? `${averageClientRating.toFixed(1)}/5` : "0/5";
  const reviewPageCount = Math.max(1, Math.ceil(sortedClientReviews.length / clientReviewsPerPage));
  const safeReviewPage = Math.min(reviewPage, reviewPageCount - 1);
  const visibleClientReviews = sortedClientReviews.slice(
    safeReviewPage * clientReviewsPerPage,
    safeReviewPage * clientReviewsPerPage + clientReviewsPerPage
  );
  const reviewCharacterCount = contactForm.message.length;
  const reviewCanSubmit =
    !isReviewSaving &&
    contactForm.message.trim().length >= reviewMinCharacters &&
    (!currentUserReview || Boolean(editingReviewId));

  useEffect(() => {
    if (!appToast.text) return undefined;

    const timeoutId = window.setTimeout(() => {
      setAppToast({ type: "", text: "" });
    }, 4800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [appToast.text]);

  useEffect(() => {
    let isCancelled = false;

    const loadReviews = async () => {
      try {
        const reviews = await fetchClientReviews();
        if (!isCancelled) {
          setClientReviews(reviews.slice(0, 100));
        }
        try {
          window.localStorage.removeItem("hm-client-reviews");
        } catch {
          // ignore storage errors
        }
      } catch (error) {
        console.warn("client reviews load skipped", error);
        try {
          window.localStorage.removeItem("hm-client-reviews");
        } catch {
          // ignore storage errors
        }
      }
    };

    loadReviews();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadAthleteCount = async () => {
      try {
        const data = await callSupabaseRpc("public_athlete_count", {});
        if (isCancelled) return;
        const value = Array.isArray(data) ? data[0] : data;
        const numeric = Number(value);
        if (Number.isFinite(numeric)) {
          setAthleteCount(numeric);
        } else {
          setAthleteCount(0);
        }
      } catch (error) {
        console.warn("athlete count load skipped", error);
        if (!isCancelled) setAthleteCount(0);
      }
    };

    loadAthleteCount();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reviewPage > reviewPageCount - 1) {
      setReviewPage(Math.max(0, reviewPageCount - 1));
    }
  }, [reviewPage, reviewPageCount]);

  useEffect(() => {
    if (!registerPersonalComplete) {
      setRegisterPersonalValidated(false);
    }
  }, [registerPersonalComplete]);

  const normalizeEmail = (value) => value.trim().toLowerCase();
  const getStoredConnectedUser = () => {
    try {
      const saved = window.localStorage.getItem("hm-current-user");
      const parsedUser = saved ? JSON.parse(saved) : null;
      const accessToken = window.sessionStorage.getItem("hm-access-token") || parsedUser?.accessToken || "";
      const refreshToken = window.sessionStorage.getItem("hm-refresh-token") || parsedUser?.refreshToken || "";

      if (!parsedUser || (!accessToken && !refreshToken)) return null;

      return {
        ...parsedUser,
        accessToken,
        refreshToken
      };
    } catch {
      return null;
    }
  };
  const clearResetFlow = () => {
    try {
      window.sessionStorage.removeItem("hm-reset-access-token");
      window.sessionStorage.removeItem("hm-reset-expires-at");
      window.localStorage.removeItem("hm-reset-access-token");
      window.localStorage.removeItem("hm-reset-expires-at");
      window.localStorage.removeItem("hm-reset-requested-at");
    } catch {
      // ignore storage errors
    }
    setResetAccessToken("");
    setResetExpiresAt(0);
    setResetRequestedAt(0);
    setResetSecondsLeft(0);
  };
  const clearPendingMailbox = () => {
    try {
      window.localStorage.removeItem("hm-auth-mailbox-email");
      window.localStorage.removeItem("hm-auth-mailbox-intent");
    } catch {
      // ignore storage errors
    }
    setPendingMailboxEmail("");
    setPendingMailboxIntent("signup");
  };

  const savePendingMailbox = (emailValue, intent) => {
    try {
      window.localStorage.setItem("hm-auth-mailbox-email", emailValue);
      window.localStorage.setItem("hm-auth-mailbox-intent", intent);
    } catch {
      // ignore storage errors
    }
    setPendingMailboxEmail(emailValue);
    setPendingMailboxIntent(intent);
  };
  const getMailboxUrl = (emailValue) => {
    const domain = normalizeEmail(emailValue).split("@")[1] || "";
    const map = {
      "gmail.com": "https://mail.google.com",
      "googlemail.com": "https://mail.google.com",
      "outlook.com": "https://outlook.live.com/mail/",
      "hotmail.com": "https://outlook.live.com/mail/",
      "live.com": "https://outlook.live.com/mail/",
      "msn.com": "https://outlook.live.com/mail/",
      "yahoo.com": "https://mail.yahoo.com",
      "yahoo.fr": "https://mail.yahoo.com",
      "icloud.com": "https://www.icloud.com/mail",
      "me.com": "https://www.icloud.com/mail",
      "mac.com": "https://www.icloud.com/mail",
      "proton.me": "https://mail.proton.me",
      "protonmail.com": "https://mail.proton.me"
    };
    return map[domain] || (domain ? `https://${domain}` : "https://mail.google.com");
  };

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [heroImages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroImages.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIfbbSlide((prev) => (prev + 1) % 2);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    setIsLangMenuOpen(false);
    setSendFeedback({ type: "", text: "" });
    setAuthFeedback({ type: "", text: "" });
    try {
      window.localStorage.setItem("hm-language", language);
    } catch {
      // ignore storage errors
    }
  }, [language, isArabic]);

  useEffect(() => {
    try {
      window.localStorage.setItem("hm-theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    const syncRoute = () => {
      setCurrentRoute({
        path: window.location.pathname || "/",
        search: window.location.search || ""
      });
    };

    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    if (!isAuthPage) return;
    const params = new URLSearchParams(currentRoute.search);
    const mode = params.get("mode");
    if (mode === "login" || mode === "register" || mode === "reset" || mode === "reset-code") {
      setAuthMode(mode === "register" ? "register" : "login");
      if (mode === "register") {
        setRegisterStep(1);
      }
      if (params.get("form") === "1" || mode === "register" || mode === "reset" || mode === "reset-code") {
        setShowAuthConfirmation(false);
      }
    }
  }, [isAuthPage, currentRoute.search]);

  useEffect(() => {
    // Un utilisateur DÉJÀ connecté ne doit jamais voir la page de connexion (« Connecté en tant que… /
    // Se déconnecter »). On le renvoie vers son espace. On laisse passer les écrans spéciaux :
    // confirmation de compte créé, vérification d'e-mail, réinitialisation, et les callbacks en cours.
    if (!isAuthPage || !currentUser) return;
    if (isAuthConfirmationPage || isAuthCheckEmailPage || isAuthResetPage || isAuthResetCodePage) return;
    const params = new URLSearchParams(currentRoute.search || "");
    if (
      params.get("signup_token") ||
      params.get("email_change_token") ||
      params.has("token_hash") ||
      params.has("code") ||
      (window.location.hash || "").includes("access_token=")
    ) {
      return;
    }
    navigateTo("/");
  }, [
    isAuthPage,
    currentUser,
    currentRoute.search,
    isAuthConfirmationPage,
    isAuthCheckEmailPage,
    isAuthResetPage,
    isAuthResetCodePage
  ]);

  useEffect(() => {
    if (!isAuthCheckEmailPage) return;
    if (pendingMailboxEmail) return;
    setShowAuthConfirmation(false);
    navigateTo(authLoginRoute);
  }, [isAuthCheckEmailPage, pendingMailboxEmail]);

  useEffect(() => {
    if (!isAuthResetCodePage) {
      setResetCodeSecondsLeft(0);
      return;
    }

    if (!pendingMailboxEmail || pendingMailboxIntent !== "recovery" || !effectiveResetRequestedAt) {
      setAuthFeedback({ type: "error", text: authText.resetCodeExpired });
      navigateTo(authLoginRoute);
      return;
    }

    const syncRemaining = () => {
      const nextSecondsLeft = clampResetCodeSeconds((effectiveResetCodeExpiresAt - Date.now()) / 1000);
      setResetCodeSecondsLeft(nextSecondsLeft);

      if (nextSecondsLeft <= 0) {
        setAuthFeedback({ type: "error", text: authText.resetCodeExpired });
      }
    };

    syncRemaining();
    const intervalId = window.setInterval(syncRemaining, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    authText.resetCodeExpired,
    effectiveResetCodeExpiresAt,
    effectiveResetRequestedAt,
    isAuthResetCodePage,
    pendingMailboxEmail,
    pendingMailboxIntent
  ]);

  useEffect(() => {
    if (!isAuthResetCodePage) return;
    const params = new URLSearchParams(currentRoute.search || "");
    const codeFromEmail = (params.get("code") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 6);
    const shouldCopyCode = params.get("copy") === "1";

    if (!codeFromEmail) return;
    setResetVerificationCode(codeFromEmail);

    if (shouldCopyCode) {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(codeFromEmail)
          .then(() => setAuthFeedback({ type: "success", text: authText.resetCodeCopied }))
          .catch(() => setAuthFeedback({ type: "success", text: authText.resetCodeCopyBlocked }));
      } else {
        setAuthFeedback({ type: "success", text: authText.resetCodeCopyBlocked });
      }
    }

    params.delete("code");
    params.delete("copy");
    const nextSearch = params.toString();
    const cleanPath = `${currentRoute.path}${nextSearch ? `?${nextSearch}` : ""}`;
    window.history.replaceState({}, "", cleanPath);
    setCurrentRoute({
      path: currentRoute.path,
      search: nextSearch ? `?${nextSearch}` : ""
    });
  }, [
    authText.resetCodeCopied,
    authText.resetCodeCopyBlocked,
    currentRoute.path,
    currentRoute.search,
    isAuthResetCodePage
  ]);

  useEffect(() => {
    if (!isAuthResetPage) {
      setIsResetValidationReady(false);
      return;
    }

    const hashParams = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
    const incomingAccessToken = hashParams.get("access_token") || "";
    const incomingType = hashParams.get("type") || "";

    if (incomingType === "recovery" && incomingAccessToken) {
      setIsResetValidationReady(false);
      return;
    }

    if (effectiveResetAccessToken && effectiveResetExpiresAt > Date.now()) {
      setIsResetValidationReady(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsResetValidationReady(true);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [effectiveResetAccessToken, effectiveResetExpiresAt, isAuthResetPage, currentRoute.search]);

  useEffect(() => {
    try {
      if (resetAccessToken) {
        window.sessionStorage.setItem("hm-reset-access-token", resetAccessToken);
        window.localStorage.setItem("hm-reset-access-token", resetAccessToken);
      } else {
        window.sessionStorage.removeItem("hm-reset-access-token");
        window.localStorage.removeItem("hm-reset-access-token");
      }
    } catch {
      // ignore storage errors
    }
  }, [resetAccessToken]);

  useEffect(() => {
    try {
      if (resetExpiresAt) {
        window.sessionStorage.setItem("hm-reset-expires-at", String(resetExpiresAt));
        window.localStorage.setItem("hm-reset-expires-at", String(resetExpiresAt));
      } else {
        window.sessionStorage.removeItem("hm-reset-expires-at");
        window.localStorage.removeItem("hm-reset-expires-at");
      }
    } catch {
      // ignore storage errors
    }
  }, [resetExpiresAt]);

  useEffect(() => {
    if (!isAuthResetPage) return;
    if (!effectiveResetAccessToken || effectiveResetExpiresAt) return;
    setResetExpiresAt(getResetLinkExpiresAt(effectiveResetAccessToken));
  }, [effectiveResetAccessToken, effectiveResetExpiresAt, isAuthResetPage]);

  useEffect(() => {
    if (!isAuthResetPage || !effectiveResetExpiresAt) return;

    const syncRemaining = () => {
      const nextSecondsLeft = Math.max(0, Math.ceil((effectiveResetExpiresAt - Date.now()) / 1000));
      setResetSecondsLeft(nextSecondsLeft);

      if (nextSecondsLeft <= 0) {
        clearResetFlow();
        setAuthFeedback({ type: "error", text: authText.resetLinkExpired });
        navigateTo(authLoginRoute);
      }
    };

    syncRemaining();
    const intervalId = window.setInterval(syncRemaining, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [authText.resetLinkExpired, effectiveResetExpiresAt, isAuthResetPage]);

  useEffect(() => {
    if (!isAuthResetPage) return;
    if (!isResetValidationReady) return;
    if (resetPageIsValid) return;
    if ((window.location.hash || "").includes("access_token=") || storedResetAccessToken) return;
    setAuthFeedback({ type: "error", text: authText.resetLinkExpired });
    navigateTo(authLoginRoute);
  }, [authText.resetLinkExpired, isAuthResetPage, isResetValidationReady, resetPageIsValid, storedResetAccessToken]);

  const signupConfirmHandledRef = useRef("");

  useEffect(() => {
    if (!isAuthPage) return;

    const searchParams = new URLSearchParams(currentRoute.search || "");
    const signupToken = searchParams.get("signup_token") || "";
    if (!signupToken) return;
    // Un token de confirmation ne peut être consommé qu'UNE fois. Sans ce garde, React StrictMode
    // (en dev) ou un re-run d'effet appellerait « confirm-signup » deux fois : le 2e appel échouerait
    // (« déjà utilisé ») et redirigerait vers le formulaire de connexion au lieu de la page
    // « Compte créé avec succès ». On garantit donc un seul appel par token.
    if (signupConfirmHandledRef.current === signupToken) return;
    signupConfirmHandledRef.current = signupToken;

    const confirmSignup = async () => {
      try {
        await callSupabaseFunction("confirm-signup", { token: signupToken });

        try {
          window.localStorage.removeItem("hm-signup-pending");
        } catch {
          // ignore storage errors
        }

        setSignupPendingEmail("");
        clearPendingMailbox();
        clearResetFlow();
        setAuthMode("login");
        setShowAuthConfirmation(true);
        setAuthFeedback({ type: "", text: "" });

        const cleanUrl = new URL(window.location.href);
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=login&confirmed=1";
        cleanUrl.hash = "";
        window.history.replaceState({}, "", cleanUrl.toString());
        setCurrentRoute({
          path: cleanUrl.pathname,
          search: cleanUrl.search
        });
      } catch (error) {
        const code = String(error?.code || "").toLowerCase();
        const text = code.includes("expired") ? authText.signupConfirmExpired : authText.signupConfirmInvalid;
        // Lien invalide / déjà utilisé : on NE déconnecte PAS et on ne force pas la page de connexion.
        // On renvoie l'utilisateur vers la page où il est déjà (son espace s'il est connecté, sinon la
        // page de connexion) et on affiche le message en toast.
        setShowAuthConfirmation(false);
        setAuthMode("login");
        setAuthFeedback({ type: "error", text });
        const cleanUrl = new URL(window.location.href);
        if (currentUser) {
          cleanUrl.pathname = "/";
          cleanUrl.search = "";
        } else {
          cleanUrl.pathname = "/auth";
          cleanUrl.search = "?mode=login&form=1";
        }
        cleanUrl.hash = "";
        window.history.replaceState({}, "", cleanUrl.toString());
        setCurrentRoute({
          path: cleanUrl.pathname,
          search: cleanUrl.search
        });
        setAppToast({ type: "error", text });
      }
    };

    confirmSignup();
  }, [authText.signupConfirmExpired, authText.signupConfirmInvalid, currentRoute.search, currentUser, isAuthPage]);

  useEffect(() => {
    if (!isAuthPage) return;

    const searchParams = new URLSearchParams(currentRoute.search || "");
    const emailChangeToken = searchParams.get("email_change_token") || "";
    if (!emailChangeToken) return;

    let isCancelled = false;

    const confirmEmailChange = async () => {
      try {
        const result = await callSupabaseFunction("confirm-email-change", { token: emailChangeToken });

        if (isCancelled) return;

        const confirmedEmail = normalizeEmail(result?.email || "");
        window.localStorage.removeItem("hm-pending-email-change");
        const storedConnectedUser = getStoredConnectedUser();
        const isConnectedForEmailChange = Boolean(currentUser || storedConnectedUser);

        if (confirmedEmail) {
          setCurrentUser((prev) =>
            prev
              ? { ...prev, email: confirmedEmail }
              : storedConnectedUser
                ? { ...storedConnectedUser, email: confirmedEmail }
                : prev
          );
        }

        setActiveNavKey("settings");
        setSettingsFeedback({
          type: "success",
          text: "Adresse email confirmée. Ton compte utilise maintenant la nouvelle adresse."
        });
        if (confirmedEmail) {
          window.localStorage.setItem("hm-email-change-confirmed", confirmedEmail);
        }
        setAppToast({
          type: "success",
          text: "Adresse changée avec succès."
        });
        setAuthFeedback({
          type: "success",
          text: "Adresse changée avec succès."
        });

        const cleanUrl = new URL(window.location.href);
        if (isConnectedForEmailChange) {
          // Connecté : on l'amène sur la page Paramètres (qui affiche la nouvelle adresse) + toast.
          cleanUrl.pathname = "/dashboard";
          cleanUrl.search = "?view=settings&email_change=confirmed";
        } else {
          // Déconnecté : on l'amène sur la page de connexion, le message/toast s'affiche dessus.
          cleanUrl.pathname = "/auth";
          cleanUrl.search = "?mode=login&form=1";
        }
        cleanUrl.hash = "";
        window.history.replaceState({}, "", cleanUrl.toString());
        setCurrentRoute({
          path: cleanUrl.pathname,
          search: cleanUrl.search
        });
      } catch (error) {
        if (isCancelled) return;

        const code = String(error?.code || "").toLowerCase();
        const storedConnectedUser = getStoredConnectedUser();
        const isConnectedForEmailChange = Boolean(currentUser || storedConnectedUser);
        const errorText = code.includes("expired")
          ? "Le lien de confirmation email a expiré."
          : "Lien invalide ou déjà utilisé.";

        if (isConnectedForEmailChange) {
          if (!currentUser && storedConnectedUser) {
            setCurrentUser(storedConnectedUser);
          }
          setActiveNavKey("settings");
          setSettingsFeedback({ type: "error", text: errorText });
          setAppToast({ type: "error", text: errorText });

          const cleanUrl = new URL(window.location.href);
          cleanUrl.pathname = "/dashboard";
          cleanUrl.search = "?view=settings&email_change=invalid";
          cleanUrl.hash = "";
          window.history.replaceState({}, "", cleanUrl.toString());
          setCurrentRoute({
            path: cleanUrl.pathname,
            search: cleanUrl.search
          });
          return;
        }

        setShowAuthConfirmation(false);
        setAuthMode("login");
        setAuthFeedback({ type: "error", text: errorText });
        setAppToast({ type: "error", text: errorText });

        const cleanUrl = new URL(window.location.href);
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=login&form=1";
        cleanUrl.hash = "";
        window.history.replaceState({}, "", cleanUrl.toString());
        setCurrentRoute({
          path: cleanUrl.pathname,
          search: cleanUrl.search
        });
      }
    };

    confirmEmailChange();

    return () => {
      isCancelled = true;
    };
  }, [currentRoute.search, currentUser, isAuthPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
    const callbackMode = searchParams.get("mode") || "";
    const callbackType = searchParams.get("type") || hashParams.get("type");
    const isCustomConfirmationScreen =
      (window.location.pathname || "/") === "/auth" &&
      callbackMode === "login" &&
      searchParams.get("confirmed") === "1" &&
      !callbackType &&
      !searchParams.has("token_hash") &&
      !hashParams.has("access_token") &&
      !hashParams.has("refresh_token") &&
      !searchParams.has("code");

    if (isCustomConfirmationScreen) {
      setAuthMode("login");
      setShowAuthConfirmation(true);
      return;
    }

    const callbackAccessToken = hashParams.get("access_token") || "";
    const callbackRefreshToken = hashParams.get("refresh_token") || "";
    const callbackErrorCode = searchParams.get("error_code") || hashParams.get("error_code");
    const callbackErrorText =
      searchParams.get("error_description") ||
      hashParams.get("error_description") ||
      searchParams.get("error") ||
      hashParams.get("error") ||
      "";
    const manualConfirmed =
      searchParams.get("confirmed") === "1" ||
      hashParams.get("confirmed") === "1" ||
      searchParams.get("email_confirmed") === "true" ||
      hashParams.get("email_confirmed") === "true";
    const hasAuthPayload =
      searchParams.has("token_hash") ||
      hashParams.has("access_token") ||
      hashParams.has("refresh_token") ||
      searchParams.has("code");
    const pendingSignup = window.localStorage.getItem("hm-signup-pending");
    const hasPendingSignup = Boolean(pendingSignup);
    const hasCallbackError =
      Boolean(callbackErrorCode) || /expired|invalid|denied|already used/i.test(callbackErrorText);
    const isSignupCallback = callbackType === "signup" || manualConfirmed;
    const isRecoveryCallback = callbackType === "recovery";
    const isEmailChangeCallback = callbackType === "email_change";
    const isResetRouteIntent = callbackMode === "reset";
    const hasAuthCallback = Boolean(callbackType) || manualConfirmed || hasAuthPayload || hasCallbackError;
    const signupConfirmed = !hasCallbackError && hasPendingSignup && (isSignupCallback || hasAuthPayload);
    const isAlreadyConnected = Boolean(currentUser);
    const canReuseStoredResetLink = Boolean(storedResetAccessToken && effectiveResetExpiresAt > Date.now());
    const requestedResetAt = (() => {
      try {
        return Number(window.localStorage.getItem("hm-reset-requested-at") || 0);
      } catch {
        return 0;
      }
    })();
    const requestBasedExpiresAt = requestedResetAt > 0 ? requestedResetAt + resetLinkLifetimeMs : 0;
    const tokenBasedExpiresAt = callbackAccessToken ? getResetLinkExpiresAt(callbackAccessToken) : 0;
    const callbackResetExpiresAt = Math.max(requestBasedExpiresAt, tokenBasedExpiresAt);

    if (!hasAuthCallback) return;

    window.localStorage.removeItem("hm-signup-pending");
    setSignupPendingEmail("");
    clearPendingMailbox();
    setShowAuthConfirmation(signupConfirmed);
    setAuthMode("login");
    setAuthFeedback({ type: "", text: "" });

    const cleanUrl = new URL(window.location.href);
    if (isResetRouteIntent) {
      if (canReuseStoredResetLink) {
        setResetAccessToken(storedResetAccessToken);
        setResetExpiresAt(effectiveResetExpiresAt);
        setResetRequestedAt(storedResetRequestedAt);
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=reset";
      } else if (!hasCallbackError && callbackAccessToken && callbackResetExpiresAt > Date.now()) {
        try {
          window.sessionStorage.setItem("hm-reset-access-token", callbackAccessToken);
          window.sessionStorage.setItem("hm-reset-expires-at", String(callbackResetExpiresAt));
        } catch {
          // ignore storage errors
        }
        setResetAccessToken(callbackAccessToken);
        setResetExpiresAt(callbackResetExpiresAt);
        setResetRequestedAt(requestedResetAt || callbackResetExpiresAt - resetLinkLifetimeMs);
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=reset";
      } else {
        clearResetFlow();
        setAuthFeedback({
          type: "error",
          text: hasCallbackError || callbackResetExpiresAt <= Date.now() ? authText.resetLinkExpired : authText.resetLinkInvalid
        });
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=login&form=1";
      }
    } else if (!hasCallbackError && isRecoveryCallback && callbackAccessToken) {
      if (callbackResetExpiresAt <= Date.now()) {
        clearResetFlow();
        setAuthFeedback({ type: "error", text: authText.resetLinkExpired });
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=login&form=1";
      } else {
        try {
          window.sessionStorage.setItem("hm-reset-access-token", callbackAccessToken);
          window.sessionStorage.setItem("hm-reset-expires-at", String(callbackResetExpiresAt));
        } catch {
          // ignore storage errors
        }
        setResetAccessToken(callbackAccessToken);
        setResetExpiresAt(callbackResetExpiresAt);
        setResetRequestedAt(requestedResetAt);
        cleanUrl.pathname = "/auth";
        cleanUrl.search = "?mode=reset";
      }
    } else if (
      canReuseStoredResetLink &&
      ((isRecoveryCallback && hasCallbackError) || (isResetRouteIntent && !callbackAccessToken))
    ) {
      setResetAccessToken(storedResetAccessToken);
      setResetExpiresAt(effectiveResetExpiresAt);
      setResetRequestedAt(storedResetRequestedAt);
      cleanUrl.pathname = "/auth";
      cleanUrl.search = "?mode=reset";
    } else if (isRecoveryCallback || isResetRouteIntent) {
      clearResetFlow();
      setAuthFeedback({
        type: "error",
        text: hasCallbackError ? authText.resetLinkExpired : authText.resetLinkInvalid
      });
      cleanUrl.pathname = "/auth";
      cleanUrl.search = "?mode=login&form=1";
    } else if (signupConfirmed) {
      clearResetFlow();
      cleanUrl.pathname = "/auth";
      cleanUrl.search = "?mode=login";
    } else if (!hasCallbackError && isEmailChangeCallback) {
      clearResetFlow();
      const tokenPayload = callbackAccessToken ? decodeJwtPayload(callbackAccessToken) : null;
      const pendingEmail = normalizeEmail(window.localStorage.getItem("hm-pending-email-change") || "");
      const confirmedEmail = normalizeEmail(tokenPayload?.email || pendingEmail || "");

      window.localStorage.removeItem("hm-pending-email-change");
      setActiveNavKey("settings");
      if (confirmedEmail) {
        setCurrentUser((prev) =>
          prev
            ? {
              ...prev,
              email: confirmedEmail,
              accessToken: callbackAccessToken || prev.accessToken,
              refreshToken: callbackRefreshToken || prev.refreshToken
            }
            : prev
        );
        setSettingsFeedback({ type: "success", text: "Adresse email confirmée. Ton compte utilise maintenant la nouvelle adresse." });
      }
      cleanUrl.pathname = "/dashboard";
      cleanUrl.search = "?view=settings&email_change=confirmed";
    } else if (isAlreadyConnected) {
      clearResetFlow();
      cleanUrl.pathname = "/";
      cleanUrl.search = "";
    } else {
      clearResetFlow();
      cleanUrl.pathname = "/auth";
      cleanUrl.search = "?mode=login&form=1";
    }
    cleanUrl.hash = "";
    window.history.replaceState({}, "", cleanUrl.toString());
    setCurrentRoute({
      path: cleanUrl.pathname,
      search: cleanUrl.search
    });
  }, [
    currentRoute.path,
    currentRoute.search,
    currentUser,
    authText.resetLinkInvalid,
    authText.resetLinkExpired,
    effectiveResetExpiresAt,
    storedResetAccessToken,
    storedResetRequestedAt
  ]);

  useEffect(() => {
    try {
      if (currentUser) {
        const { accessToken, refreshToken, ...safeUser } = currentUser;
        window.localStorage.setItem("hm-current-user", JSON.stringify(safeUser));
        if (accessToken) {
          window.sessionStorage.setItem("hm-access-token", accessToken);
        }
        if (refreshToken) {
          window.sessionStorage.setItem("hm-refresh-token", refreshToken);
        }
      } else {
        window.localStorage.removeItem("hm-current-user");
        window.sessionStorage.removeItem("hm-access-token");
        window.sessionStorage.removeItem("hm-refresh-token");
      }
    } catch {
      // ignore storage errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      if (currentUser) {
        window.localStorage.setItem("hm-sport-profile", JSON.stringify(sportProfile));
      } else {
        window.localStorage.removeItem("hm-sport-profile");
      }
    } catch {
      // ignore storage errors
    }
  }, [currentUser, sportProfile]);

  useEffect(() => {
    if (!currentUser) {
      setSettingsForm(emptySettingsForm);
      setSettingsFeedback({ type: "", text: "" });
      return;
    }

    setSettingsForm(profileSettingsToForm(currentUser, sportProfile));
    setSettingsFeedback({ type: "", text: "" });
  }, [currentUser?.id, sportProfile]);

  useEffect(() => {
    if (currentRoute.path !== "/dashboard") return;

    const params = new URLSearchParams(currentRoute.search || "");
    const requestedView = params.get("view") || "dashboard";
    if (dashboardNavKeys.has(requestedView)) {
      setActiveNavKey(requestedView);
    }
    if (params.get("email_change") === "confirmed") {
      const pendingEmail = normalizeEmail(window.localStorage.getItem("hm-pending-email-change") || "");
      if (pendingEmail) {
        setCurrentUser((prev) => (prev ? { ...prev, email: pendingEmail } : prev));
        window.localStorage.removeItem("hm-pending-email-change");
      }
      setSettingsFeedback({
        type: "success",
        text: "Adresse changée avec succès."
      });
    }
    if (params.get("email_change") === "invalid") {
      setSettingsFeedback({ type: "error", text: "Lien invalide ou déjà utilisé." });
    }
  }, [currentRoute.path, currentRoute.search]);

  useEffect(() => {
    if ((isCompleteProfilePage || isDashboardPage) && !currentUser) {
      navigateTo(authLoginRoute);
      return;
    }

    // Le coach ne passe jamais par « compléter le profil » ni par la page d'accueil (vitrine) : on le renvoie vers son espace.
    if ((isCompleteProfilePage || isHomePage) && currentUser && isCoachUser(currentUser)) {
      navigateTo("/dashboard?view=settings");
      return;
    }

    // Onboarding obligatoire : un utilisateur connecté qui n'a pas terminé son profil sportif
    // (nouveau compte) va DIRECTEMENT sur « compléter le profil », et n'est jamais laissé sur la
    // page d'accueil ni sur le dashboard. (sportProfileCompleted est fiable : posé à la connexion /
    // restauration de session, et mis à true une fois le profil complété → pas de boucle ni de flash.)
    if (
      currentUser &&
      !isCoachUser(currentUser) &&
      currentUser.sportProfileCompleted === false &&
      (isDashboardPage || isHomePage)
    ) {
      navigateTo("/complete-profile");
    }
  }, [currentUser, isCompleteProfilePage, isDashboardPage, isHomePage, sportProfile]);

  useEffect(() => {
    if (isAuthPage) return;
    const updateActiveSection = () => {
      const scrollAnchor = window.scrollY + 180;
      let currentSection = navSectionIds[0];

      navSectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && scrollAnchor >= section.offsetTop) {
          currentSection = sectionId;
        }
      });

      setActiveNavSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isAuthPage]);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal-up"));
    if (revealElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      revealElements.forEach((element) => {
        element.classList.remove("reveal-ready");
        element.classList.add("is-visible");
      });
      return;
    }

    revealElements.forEach((element, index) => {
      element.classList.remove("is-visible");
      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
    });

    const revealElement = (element) => {
      element.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    const initialRevealId = window.requestAnimationFrame(() => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          revealElement(element);
          observer.unobserve(element);
        }
      });
    });

    const safetyRevealId = window.setTimeout(() => {
      revealElements.forEach((element) => revealElement(element));
    }, 2300);

    return () => {
      window.cancelAnimationFrame(initialRevealId);
      window.clearTimeout(safetyRevealId);
      observer.disconnect();
    };
  }, [language, theme]);

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      const text = content.contact.loginRequired || "Connecte-toi à ton compte pour partager ton avis";
      setAppToast({ type: "error", text });
      setSendFeedback({ type: "error", text });
      return;
    }

    const trimmedMessage = contactForm.message.trim();

    if (!trimmedMessage || !contactForm.rating) {
      setSendFeedback({
        type: "error",
        text: content.contact.feedbackRequired
      });
      return;
    }

    if (trimmedMessage.length < reviewMinCharacters || trimmedMessage.length > reviewMaxCharacters) {
      setSendFeedback({
        type: "error",
        text: content.contact.feedbackLength
      });
      return;
    }

    if (currentUserReview && !editingReviewId) {
      return;
    }

    setIsReviewSaving(true);

    try {
      let sessionUser = null;
      try {
        sessionUser = await refreshCurrentUserSession();
      } catch {
        const text = content.contact.loginRequired || "Connecte-toi à ton compte pour partager ton avis";
        setAppToast({ type: "error", text });
        setSendFeedback({ type: "error", text });
        return;
      }

      const savedReview = await saveClientReview({
        accessToken: sessionUser.accessToken,
        rating: contactForm.rating,
        message: trimmedMessage
      });

      if (!savedReview) {
        throw new Error("REVIEW_SAVE_FAILED");
      }

      setClientReviews((prev) => [savedReview, ...prev.filter((review) => review.authorId !== savedReview.authorId)].slice(0, 100));
      setSendFeedback({ type: "", text: "" });
      const wasEditing = Boolean(editingReviewId);
      // On garde le formulaire pré-rempli et le bouton actif après enregistrement :
      // l'athlète peut re-modifier. Le formulaire ne se vide qu'à la suppression de l'avis.
      setEditingReviewId(savedReview.id);
      setHighlightedReviewId(savedReview.id);
      setReviewPage(0);
      setContactForm({
        message: savedReview.message,
        rating: savedReview.rating
      });
      setAppToast({
        type: "success",
        text: wasEditing ? "Avis modifié avec succès." : "Avis partagé avec succès."
      });
    } catch (error) {
      console.error("review save failed", error);
      const fallback = "Impossible d’enregistrer ton avis pour le moment.";
      const detail = error?.message && error.message !== "SUPABASE_FUNCTION_FAILED" ? error.message : "";
      const text =
        error?.code === "AUTH_REQUIRED"
          ? content.contact.loginRequired || "Connecte-toi à ton compte pour partager ton avis"
          : detail
            ? `${fallback} (${detail})`
            : fallback;
      setSendFeedback({ type: "error", text });
      if (error?.code === "AUTH_REQUIRED") {
        setAppToast({ type: "error", text });
      }
    } finally {
      setIsReviewSaving(false);
    }
  };

  const handleEditReview = (review) => {
    if (!currentUser?.id || review.authorId !== currentUser.id) return;
    setEditingReviewId(review.id);
    setContactForm({
      message: review.message,
      rating: review.rating
    });
    setSendFeedback({ type: "", text: "" });
    window.requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleDeleteReview = async (reviewId) => {
    const reviewToDelete = clientReviews.find((review) => review.id === reviewId && review.authorId === currentUser?.id);
    if (!reviewToDelete) return;

    setIsReviewSaving(true);

    try {
      let sessionUser = null;
      try {
        sessionUser = await refreshCurrentUserSession();
      } catch {
        const text = content.contact.loginRequired || "Connecte-toi à ton compte pour partager ton avis";
        setAppToast({ type: "error", text });
        setSendFeedback({ type: "error", text });
        return;
      }

      await deleteClientReview({ accessToken: sessionUser.accessToken });
      setClientReviews((prev) => prev.filter((review) => review.authorId !== currentUser?.id));
      if (editingReviewId === reviewId) {
        setEditingReviewId("");
        setContactForm({ message: "", rating: 0 });
      }
      if (highlightedReviewId === reviewId) {
        setHighlightedReviewId("");
      }
      setReviewPage(0);
      setSendFeedback({ type: "", text: "" });
      setAppToast({ type: "success", text: "Avis supprimé avec succès." });
    } catch (error) {
      const text =
        error?.code === "AUTH_REQUIRED"
          ? content.contact.loginRequired || "Connecte-toi à ton compte pour partager ton avis"
          : "Impossible de supprimer ton avis pour le moment.";
      setSendFeedback({ type: "error", text });
      if (error?.code === "AUTH_REQUIRED") {
        setAppToast({ type: "error", text });
      }
    } finally {
      setIsReviewSaving(false);
    }
  };

  const handleViewMyReview = () => {
    if (!currentUserReview) return;

    const reviewIndex = sortedClientReviews.findIndex((review) => review.id === currentUserReview.id);
    setReviewPage(Math.max(0, Math.floor(reviewIndex / clientReviewsPerPage)));
    setHighlightedReviewId(currentUserReview.id);
    window.requestAnimationFrame(() => {
      document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const navigateTo = (path) => {
    const target = path || "/";
    const nextUrl = new URL(target, window.location.origin);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    const nextPath = `${nextUrl.pathname}${nextUrl.search}`;
    if (currentUrl === nextPath) return;

    window.history.pushState({}, "", nextPath);
    setCurrentRoute({
      path: window.location.pathname || "/",
      search: window.location.search || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToAuth = (mode) => {
    const nextMode = mode === "register" ? "register" : "login";
    setShowAuthConfirmation(false);
    setAuthMode(nextMode);
    setRegisterStep(1);
    setRegisterPersonalValidated(false);
    setAuthFeedback({ type: "", text: "" });
    navigateTo(nextMode === "login" ? authLoginRoute : `/auth?mode=${nextMode}`);
  };

  const completeLoginFlow = async (loginData) => {
    const user = loginData.user;
    const metadata = user?.user_metadata || {};
    const accessToken = loginData.access_token || "";
    const refreshToken = loginData.refresh_token || "";

    if (!user?.id || !accessToken) {
      throw new Error("SESSION_REQUIRED");
    }

    setIsSportProfileLoading(true);
    let profile;
    try {
      const baseProfile = loginData.profile ? normalizeSportProfile(loginData.profile) : await fetchSportProfile(user.id, accessToken);
      profile = normalizeSportProfile({
        ...baseProfile,
        has_no_supplement: Boolean(metadata.has_no_supplement),
        dietary_supplements: Array.isArray(metadata.dietary_supplements) ? metadata.dietary_supplements : [],
        has_no_injury: Boolean(metadata.has_no_injury),
        injury_history: Array.isArray(metadata.injury_history) ? metadata.injury_history : [],
        has_no_medical_information: Boolean(metadata.has_no_medical_information),
        sport_goal_custom: metadata.sport_goal_custom || "",
        medical_information: Array.isArray(metadata.medical_information) ? metadata.medical_information : []
      });
    } finally {
      setIsSportProfileLoading(false);
    }
    const profileCompleted = isSportProfileComplete(profile);
    const finalFirstName = profile.first_name || metadata.first_name || "";
    const finalLastName = profile.last_name || metadata.last_name || "";
    const finalFullName = `${finalFirstName} ${finalLastName}`.trim() || metadata.full_name || "";

    setSportProfile(profile);
    setSportProfileForm(sportProfileToForm(profile));
    setSportProfileFeedback({ type: "", text: "" });
    const nextUser = {
      id: user.id,
      firstName: finalFirstName,
      lastName: finalLastName,
      fullName: finalFullName || user.email || metadata.email || "Athlete",
      email: user.email || authForm.email,
      sex: profile.sex || metadata.sex || "",
      country: profile.country_code || metadata.country_code || "",
      avatarUrl: profile.avatar_url || metadata.avatar_url || "",
      hasNoSupplement: profile.has_no_supplement,
      dietarySupplements: profile.dietary_supplements,
      hasNoInjury: profile.has_no_injury,
      injuryHistory: profile.injury_history,
      hasNoMedicalInformation: profile.has_no_medical_information,
      medicalInformation: profile.medical_information,
      phoneNumber: metadata.phone_number || "",
      phoneCountryCode: metadata.phone_country_code || "",
      phoneVerifiedAt: metadata.phone_verified_at || "",
      addressLine1: metadata.address_line1 || "",
      addressLine2: metadata.address_line2 || "",
      postalCode: metadata.postal_code || "",
      city: metadata.city || "",
      region: metadata.region || "",
      accessToken,
      refreshToken,
      sportProfileCompleted: profileCompleted
    };
    setCurrentUser(nextUser);
    window.localStorage.removeItem("hm-signup-pending");
    setSignupPendingEmail("");
    clearPendingMailbox();
    clearResetFlow();
    const confirmedEmailChange = normalizeEmail(window.localStorage.getItem("hm-email-change-confirmed") || "");
    const shouldOpenSettingsAfterEmailChange =
      confirmedEmailChange && confirmedEmailChange === normalizeEmail(nextUser.email || "");

    if (shouldOpenSettingsAfterEmailChange) {
      window.localStorage.removeItem("hm-email-change-confirmed");
      setActiveNavKey("settings");
      setSettingsFeedback({ type: "success", text: "Adresse changée avec succès." });
      setAppToast({ type: "success", text: "Adresse changée avec succès." });
      setAuthFeedback({ type: "", text: "" });
      navigateTo("/dashboard?view=settings&email_change=confirmed");
      return;
    }

    setAuthFeedback({ type: "success", text: authText.loginSuccess });
    if (isCoachEmail(nextUser.email) && nextUser.id) rememberCoachUid(nextUser.id);
    if (isCoachUser(nextUser)) {
      // Le coach accède directement à son espace (Paramètres), sans « compléter le profil ».
      navigateTo("/dashboard?view=settings");
      return;
    }
    if (!profileCompleted) {
      navigateTo("/complete-profile");
      return;
    }
    navigateTo("/");
  };

  const refreshCurrentUserSession = async () => {
    if (!currentUser?.id) {
      throw new Error("SESSION_REQUIRED");
    }

    if (currentUser.accessToken && !isAccessTokenExpired(currentUser.accessToken)) {
      return currentUser;
    }

    if (!currentUser.refreshToken) {
      throw new Error("SESSION_EXPIRED");
    }

    const refreshData = await callSupabaseAuth("token?grant_type=refresh_token", {
      refresh_token: currentUser.refreshToken
    });
    const nextAccessToken = refreshData.access_token || "";
    const nextRefreshToken = refreshData.refresh_token || currentUser.refreshToken || "";

    if (!nextAccessToken) {
      throw new Error("SESSION_EXPIRED");
    }

    const nextUser = {
      ...currentUser,
      email: refreshData.user?.email || currentUser.email,
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken
    };

    setCurrentUser(nextUser);
    return nextUser;
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    const firstName = authForm.firstName.trim();
    const lastName = authForm.lastName.trim();
    const birthDate = authForm.birthDate;
    const sex = authForm.sex;
    const country = authForm.country;
    const email = normalizeEmail(authForm.email);
    const password = authForm.password;
    const confirmPassword = authForm.confirmPassword;

    if (authMode === "register" && registerStep === 1) {
      if (!firstName || !lastName || !birthDate || !sex || !country) {
        setAuthFeedback({ type: "error", text: authText.fillAll });
        return;
      }
      if (!isAdultBirthDate(birthDate)) {
        setAuthFeedback({ type: "error", text: authText.ageRestriction });
        return;
      }
      setAuthFeedback({ type: "", text: "" });
      setRegisterPersonalValidated(true);
      setRegisterStep(2);
      return;
    }

    if (
      !email ||
      !password ||
      (authMode === "register" && (!firstName || !lastName || !birthDate || !sex || !country || !confirmPassword))
    ) {
      setAuthFeedback({ type: "error", text: authText.fillAll });
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setAuthFeedback({ type: "error", text: authText.invalidEmail });
      return;
    }

    if (!hasSupabaseConfig) {
      setAuthFeedback({ type: "error", text: authText.supabaseConfigMissing });
      return;
    }

    try {
      if (authMode === "register") {
        if (!isAdultBirthDate(birthDate)) {
          setRegisterStep(1);
          setRegisterPersonalValidated(false);
          setAuthFeedback({ type: "error", text: authText.ageRestriction });
          return;
        }
        if (!isPasswordStrong(password)) {
          setAuthFeedback({ type: "error", text: authText.passwordStrongRequired || authText.passwordShort });
          return;
        }
        if (password !== confirmPassword) {
          setAuthFeedback({ type: "error", text: authText.passwordMismatch });
          return;
        }

        try {
          const emailExists = await callSupabaseRpc("email_exists", { check_email: email });
          if (emailExists === true) {
            setAuthFeedback({ type: "error", text: authText.userExists });
            return;
          }
        } catch (rpcError) {
          const rpcErrorMessage = String(rpcError?.message || "").toLowerCase();
          // If the SQL function is not deployed yet, keep the old fallback detection below.
          if (
            rpcErrorMessage !== "supabase_rpc_failed" &&
            !rpcErrorMessage.includes("could not find the function") &&
            !rpcErrorMessage.includes("schema cache")
          ) {
            throw rpcError;
          }
        }

        await callSupabaseFunction("send-signup-confirmation", {
          firstName,
          lastName,
          birthDate,
          sex,
          country,
          email,
          password,
          signupClientId: getOrCreateSignupClientId()
        });

        window.localStorage.setItem("hm-signup-pending", email);
        setCurrentUser(null);
        setSignupPendingEmail(email);
        savePendingMailbox(email, "signup");
        setAuthMode("login");
        navigateTo("/auth?mode=check-email");
        setAuthFeedback({ type: "success", text: authText.registerSuccess });
      } else {
        const loginData = await callSupabaseFunction("auth-login", {
          email,
          password
        });
        await completeLoginFlow(loginData);
      }
    } catch (error) {
      const errorMessage = String(error?.message || "");
      const normalizedError = errorMessage.toLowerCase();
      const normalizedCode = String(error?.code || "").toLowerCase();

      if (errorMessage === "SUPABASE_CONFIG_MISSING") {
        setAuthFeedback({ type: "error", text: authText.supabaseConfigMissing });
        return;
      }

      if (
        normalizedError.includes("failed to fetch") ||
        normalizedError.includes("networkerror") ||
        normalizedError.includes("load failed")
      ) {
        setAuthFeedback({ type: "error", text: authText.networkError || authText.invalidCredentials });
        return;
      }

      if (normalizedError.includes("email not confirmed")) {
        setAuthFeedback({ type: "error", text: authText.emailNotConfirmed });
        return;
      }

      if (
        normalizedCode.includes("over_email_send_rate_limit") ||
        normalizedError.includes("rate limit") ||
        normalizedError.includes("too many requests") ||
        normalizedError.includes("email rate limit exceeded") ||
        normalizedError.includes("over_email_send_rate_limit")
      ) {
        window.localStorage.setItem("hm-signup-pending", email);
        setSignupPendingEmail(email);
        savePendingMailbox(email, "signup");
        setAuthMode("login");
        setAuthFeedback({ type: "success", text: authText.registerSuccess });
        navigateTo("/auth?mode=check-email");
        return;
      }

      if (
        normalizedCode.includes("user_exists") ||
        normalizedError.includes("already registered") ||
        normalizedError.includes("already exists") ||
        normalizedError.includes("already been registered") ||
        normalizedError.includes("user already exists")
      ) {
        setAuthFeedback({ type: "error", text: authText.userExists });
        return;
      }

      if (normalizedError.includes("invalid login credentials")) {
        setAuthFeedback({ type: "error", text: authText.invalidCredentials });
        return;
      }

      setAuthFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_REQUEST_FAILED" ? errorMessage : authText.invalidCredentials
      });
      return;
    }

    setRegisterStep(1);
    setAuthForm({
      firstName: "",
      lastName: "",
      birthDate: "",
      sex: "",
      country: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSportProfile(normalizeSportProfile());
    setSportProfileForm(emptySportProfileForm);
    setSportProfileFeedback({ type: "", text: "" });
    clearResetFlow();
    setAuthFeedback({ type: "success", text: authText.logoutSuccess });
    navigateTo("/");
  };

  const handleForgotPassword = async () => {
    const email = normalizeEmail(authForm.email);

    if (!email) {
      setAuthFeedback({ type: "error", text: authText.forgotPasswordFillEmail });
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setAuthFeedback({ type: "error", text: authText.invalidEmail });
      return;
    }

    if (!hasSupabaseConfig) {
      setAuthFeedback({ type: "error", text: authText.supabaseConfigMissing });
      return;
    }

    const storedActiveResetAt = (() => {
      try {
        return Number(window.localStorage.getItem("hm-reset-requested-at") || 0);
      } catch {
        return 0;
      }
    })();
    const storedPendingResetEmail = (() => {
      try {
        return normalizeEmail(window.localStorage.getItem("hm-auth-mailbox-email") || "");
      } catch {
        return "";
      }
    })();
    const storedPendingResetIntent = (() => {
      try {
        return window.localStorage.getItem("hm-auth-mailbox-intent") || "";
      } catch {
        return "";
      }
    })();
    const activeResetSecondsLeft = Math.max(
      0,
      clampResetCodeSeconds((storedActiveResetAt + resetLinkLifetimeMs - Date.now()) / 1000)
    );

    if (
      activeResetSecondsLeft > 0 &&
      storedPendingResetIntent === "recovery" &&
      (!storedPendingResetEmail || storedPendingResetEmail === email)
    ) {
      setAuthFeedback({
        type: "error",
        text: `${authText.resetCodeRetryWait} ${formatAuthSeconds(activeResetSecondsLeft)}.`
      });
      savePendingMailbox(storedPendingResetEmail || email, "recovery");
      navigateTo("/auth?mode=reset-code");
      return;
    }

    try {
      const sendData = await callSupabaseFunction("send-reset-code", { email });
      const expiresAtMs = sendData?.expiresAt ? new Date(sendData.expiresAt).getTime() : Date.now() + resetLinkLifetimeMs;
      const requestedAt = getResetRequestedAtFromExpiresAt(expiresAtMs);

      try {
        window.localStorage.setItem("hm-reset-requested-at", String(requestedAt));
      } catch {
        // ignore storage errors
      }

      setResetRequestedAt(requestedAt);
      savePendingMailbox(email, "recovery");
      setResetVerificationCode("");
      setAuthFeedback({ type: "", text: "" });
      navigateTo("/auth?mode=reset-code");
    } catch (error) {
      if (error?.code === "ACCOUNT_NOT_FOUND" || error?.status === 404) {
        setAuthFeedback({ type: "error", text: authText.accountNotFound });
        return;
      }

      if (error?.code === "RESET_CODE_ACTIVE" || error?.status === 429) {
        const retryAfterSeconds = clampResetCodeSeconds(error.retryAfterSeconds || 0);
        const expiresAtMs = error.expiresAt ? new Date(error.expiresAt).getTime() : Date.now() + retryAfterSeconds * 1000;
        const requestedAt = getResetRequestedAtFromExpiresAt(expiresAtMs);

        try {
          window.localStorage.setItem("hm-reset-requested-at", String(requestedAt));
        } catch {
          // ignore storage errors
        }

        setResetRequestedAt(requestedAt);
        savePendingMailbox(email, "recovery");
        setResetVerificationCode("");
        setAuthFeedback({
          type: "error",
          text: `${authText.resetCodeRetryWait} ${formatAuthSeconds(retryAfterSeconds || activeResetSecondsLeft || 1)}.`
        });
        navigateTo("/auth?mode=reset-code");
        return;
      }

      const errorMessage = String(error?.message || "");
      setAuthFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_FUNCTION_FAILED" ? errorMessage : authText.invalidEmail
      });
    }
  };

  const handleResendResetCode = async () => {
    const email = normalizeEmail(pendingMailboxEmail);

    if (!email) {
      setAuthFeedback({ type: "error", text: authText.accountNotFound });
      navigateTo(authLoginRoute);
      return;
    }

    if (!hasSupabaseConfig) {
      setAuthFeedback({ type: "error", text: authText.supabaseConfigMissing });
      return;
    }

    try {
      const sendData = await callSupabaseFunction("send-reset-code", { email });
      const expiresAtMs = sendData?.expiresAt ? new Date(sendData.expiresAt).getTime() : Date.now() + resetLinkLifetimeMs;
      const requestedAt = getResetRequestedAtFromExpiresAt(expiresAtMs);

      try {
        window.localStorage.setItem("hm-reset-requested-at", String(requestedAt));
      } catch {
        // ignore storage errors
      }

      setResetRequestedAt(requestedAt);
      setResetVerificationCode("");
      setResetCodeSecondsLeft(clampResetCodeSeconds((expiresAtMs - Date.now()) / 1000));
      setAuthFeedback({ type: "success", text: authText.forgotPasswordInfo });
    } catch (error) {
      if (error?.code === "ACCOUNT_NOT_FOUND" || error?.status === 404) {
        setAuthFeedback({ type: "error", text: authText.accountNotFound });
        navigateTo(authLoginRoute);
        return;
      }

      if (error?.code === "RESET_CODE_ACTIVE" || error?.status === 429) {
        const retryAfterSeconds = clampResetCodeSeconds(error.retryAfterSeconds || 0);
        const expiresAtMs = error.expiresAt ? new Date(error.expiresAt).getTime() : Date.now() + retryAfterSeconds * 1000;
        const requestedAt = getResetRequestedAtFromExpiresAt(expiresAtMs);

        try {
          window.localStorage.setItem("hm-reset-requested-at", String(requestedAt));
        } catch {
          // ignore storage errors
        }

        setResetRequestedAt(requestedAt);
        setResetVerificationCode("");
        setResetCodeSecondsLeft(Math.max(1, retryAfterSeconds));
        setAuthFeedback({
          type: "error",
          text: `${authText.resetCodeRetryWait} ${formatAuthSeconds(retryAfterSeconds || 1)}.`
        });
        return;
      }

      const errorMessage = String(error?.message || "");
      setAuthFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_FUNCTION_FAILED" ? errorMessage : authText.invalidEmail
      });
    }
  };

  const handleVerifyResetCode = async (event) => {
    event.preventDefault();

    const code = resetVerificationCode.trim();
    const email = normalizeEmail(pendingMailboxEmail);
    const codePattern = /^[A-Za-z0-9]{6}$/;

    if (!code) {
      setAuthFeedback({ type: "error", text: authText.resetCodeRequired });
      return;
    }

    if (!codePattern.test(code)) {
      setAuthFeedback({ type: "error", text: authText.resetCodeInvalid });
      return;
    }

    if (!email) {
      setAuthFeedback({ type: "error", text: authText.accountNotFound });
      navigateTo(authLoginRoute);
      return;
    }

    if (!hasSupabaseConfig) {
      setAuthFeedback({ type: "error", text: authText.supabaseConfigMissing });
      return;
    }

    if (!effectiveResetCodeExpiresAt || effectiveResetCodeExpiresAt <= Date.now()) {
      setAuthFeedback({ type: "error", text: authText.resetCodeExpired });
      return;
    }

    try {
      const verifyData = await callSupabaseFunction("verify-reset-code", { email, code });
      const nextResetToken = verifyData?.resetToken || "";
      const resetPasswordExpiresAt = verifyData?.expiresAt
        ? new Date(verifyData.expiresAt).getTime()
        : Date.now() + resetPasswordSessionLifetimeMs;

      if (!nextResetToken) {
        throw new Error("INVALID_RESET_TOKEN");
      }

      try {
        window.sessionStorage.setItem("hm-reset-access-token", nextResetToken);
        window.sessionStorage.setItem("hm-reset-expires-at", String(resetPasswordExpiresAt));
        window.localStorage.setItem("hm-reset-access-token", nextResetToken);
        window.localStorage.setItem("hm-reset-expires-at", String(resetPasswordExpiresAt));
      } catch {
        // ignore storage errors
      }

      setResetAccessToken(nextResetToken);
      setResetExpiresAt(resetPasswordExpiresAt);
      setResetRequestedAt(effectiveResetRequestedAt);
      setResetVerificationCode("");
      setAuthFeedback({ type: "", text: "" });
      navigateTo("/auth?mode=reset");
    } catch (error) {
      if (error?.code === "RESET_CODE_EXPIRED" || error?.status === 410) {
        setAuthFeedback({ type: "error", text: authText.resetCodeExpired });
        return;
      }

      if (error?.code === "ACCOUNT_NOT_FOUND" || error?.status === 404) {
        setAuthFeedback({ type: "error", text: authText.accountNotFound });
        navigateTo(authLoginRoute);
        return;
      }

      setAuthFeedback({ type: "error", text: authText.resetCodeInvalid });
    }
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    const password = authForm.password;
    const confirmPassword = authForm.confirmPassword;

    if (!password || !confirmPassword) {
      setAuthFeedback({ type: "error", text: authText.fillAll });
      return;
    }

    if (!isPasswordStrong(password)) {
      setAuthFeedback({ type: "error", text: authText.passwordStrongRequired || authText.passwordShort });
      return;
    }

    if (password !== confirmPassword) {
      setAuthFeedback({ type: "error", text: authText.passwordMismatch });
      return;
    }

    if (!effectiveResetAccessToken || (effectiveResetExpiresAt && effectiveResetExpiresAt <= Date.now())) {
      clearResetFlow();
      setAuthFeedback({ type: "error", text: authText.resetLinkExpired });
      navigateTo(authLoginRoute);
      return;
    }

    try {
      await callSupabaseFunction("complete-reset-password", {
        resetToken: effectiveResetAccessToken,
        password
      });

      clearResetFlow();
      clearPendingMailbox();
      setAuthForm({
        firstName: "",
        lastName: "",
        birthDate: "",
        sex: "",
        country: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setAuthFeedback({ type: "success", text: authText.resetSuccess });
      navigateTo(authLoginRoute);
    } catch (error) {
      const code = error?.code || "";
      const errorMessage = String(error?.message || "");
      const normalizedError = errorMessage.toLowerCase();

      if (
        code === "RESET_SESSION_EXPIRED" ||
        code === "RESET_SESSION_INVALID" ||
        error?.status === 401 ||
        error?.status === 410 ||
        normalizedError.includes("expired") ||
        normalizedError.includes("invalid")
      ) {
        clearResetFlow();
        setAuthFeedback({
          type: "error",
          text: code === "RESET_SESSION_EXPIRED" || normalizedError.includes("expired") ? authText.resetLinkExpired : authText.resetLinkInvalid
        });
        navigateTo(authLoginRoute);
        return;
      }

      setAuthFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_FUNCTION_FAILED" ? errorMessage : authText.resetLinkInvalid
      });
    }
  };

  const handleSportProfileSubmit = async (event) => {
    event.preventDefault();

    const height = Number(sportProfileForm.heightCm);
    const weight = Number(sportProfileForm.currentWeightKg);
    const sportsAreValid = areSportFieldsValid(sportProfileForm);
    const supplementsAreValid = areSupplementFieldsValid(sportProfileForm);
    const injuriesAreValid = areInjuryFieldsValid(sportProfileForm);
    const medicalInformationIsValid = areMedicalFieldsValid(sportProfileForm);
    const hasRequiredValues = Boolean(
      height >= 80 &&
      height <= 260 &&
      Number.isInteger(height) &&
      weight >= 25 &&
      weight <= 350 &&
      isSportGoalFieldValid(sportProfileForm) &&
      sportsAreValid &&
      supplementsAreValid &&
      injuriesAreValid &&
      medicalInformationIsValid
    );

    if (!hasRequiredValues) {
      setSportProfileFeedback({ type: "error", text: profileText.requiredError });
      return;
    }

    if (!currentUser?.id || (!currentUser?.accessToken && !currentUser?.refreshToken)) {
      setSportProfileFeedback({ type: "error", text: profileText.sessionExpired });
      setCurrentUser(null);
      navigateTo(authLoginRoute);
      return;
    }

    setIsSportProfileSaving(true);
    try {
      const sessionUser = await refreshCurrentUserSession();
      const payload = sportProfileFormToPayload(sportProfileForm);
      const dietarySupplements = sportProfileFormToSupplements(sportProfileForm);
      const injuryHistory = sportProfileFormToInjuries(sportProfileForm);
      const medicalInformation = sportProfileFormToMedicalInformation(sportProfileForm);
      const updatedProfile = await updateSportProfile(sessionUser.id, sessionUser.accessToken, payload);
      await callSupabaseFunctionWithAuth(
        "update-account-security",
        {
          metadata: {
            has_no_supplement: Boolean(sportProfileForm.hasNoSupplement),
            dietary_supplements: dietarySupplements,
            has_no_injury: Boolean(sportProfileForm.hasNoInjury),
            injury_history: injuryHistory,
            has_no_medical_information: Boolean(sportProfileForm.hasNoMedicalInformation),
            sport_goal_custom: sportProfileForm.sportGoal === "other" ? sportProfileForm.sportGoalCustom.trim() : "",
            medical_information: medicalInformation
          }
        },
        sessionUser.accessToken
      );
      const hydratedProfile = normalizeSportProfile({
        ...updatedProfile,
        has_no_supplement: Boolean(sportProfileForm.hasNoSupplement),
        dietary_supplements: dietarySupplements,
        has_no_injury: Boolean(sportProfileForm.hasNoInjury),
        injury_history: injuryHistory,
        has_no_medical_information: Boolean(sportProfileForm.hasNoMedicalInformation),
        sport_goal_custom: sportProfileForm.sportGoal === "other" ? sportProfileForm.sportGoalCustom.trim() : "",
        medical_information: medicalInformation
      });

      setSportProfile(hydratedProfile);
      setSportProfileForm(sportProfileToForm(hydratedProfile));
      setCurrentUser((prev) =>
        prev
          ? {
            ...prev,
            hasNoSupplement: hydratedProfile.has_no_supplement,
            dietarySupplements: hydratedProfile.dietary_supplements,
            hasNoInjury: hydratedProfile.has_no_injury,
            injuryHistory: hydratedProfile.injury_history,
            hasNoMedicalInformation: hydratedProfile.has_no_medical_information,
            medicalInformation: hydratedProfile.medical_information,
            sportProfileCompleted: isSportProfileComplete(hydratedProfile)
          }
          : prev
      );
      setSportProfileFeedback({ type: "success", text: profileText.success });
      // Profil complété → on présente la page « Accéder à mon espace athlète » (page d'accueil avec
      // le bouton d'accès), au lieu d'aller directement au dashboard.
      navigateTo("/");
    } catch (error) {
      const errorMessage = String(error?.message || "");
      const normalizedError = errorMessage.toLowerCase();
      if (
        normalizedError.includes("session") ||
        normalizedError.includes("jwt") ||
        normalizedError.includes("expired")
      ) {
        setCurrentUser(null);
        navigateTo(authLoginRoute);
      }
      setSportProfileFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_REST_FAILED" ? errorMessage : profileText.sessionExpired
      });
    } finally {
      setIsSportProfileSaving(false);
    }
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setSettingsFeedback({ type: "", text: "" });

    try {
      const avatarUrl = await resizeAvatarFile(file);
      setSettingsForm((prev) => ({ ...prev, avatarUrl }));
      setSettingsFeedback({
        type: "success",
        text: "Photo ajoutée. Clique sur Enregistrer le profil pour la garder dans ton profil."
      });
    } catch (error) {
      const code = String(error?.message || "");
      setSettingsFeedback({
        type: "error",
        text:
          code === "PHOTO_TOO_LARGE"
            ? "La photo est trop lourde. Choisis une image de moins de 6 Mo."
            : "Impossible d’ajouter cette photo. Choisis une image JPG ou PNG."
      });
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();

    const firstName = settingsForm.firstName.trim();
    const lastName = settingsForm.lastName.trim();
    const submitter = event.nativeEvent?.submitter || null;
    const submitAction =
      submitter?.dataset?.settingsAction ||
      submitter?.getAttribute?.("data-settings-action") ||
      event.currentTarget?.dataset?.submitAction ||
      "";
    const isEmailConfirmAction = submitAction === "confirm-email";
    const isPasswordAction = submitAction === "password";
    const isProfileAction = submitAction === "profile";
    const isContactAction = submitAction === "contact";
    const isSportProfileAction = submitAction === "sport-profile";
    const isNutritionAction = submitAction === "nutrition";
    const isHealthAction = submitAction === "health";
    const isFullSettingsAction = !submitAction;
    const height = Number(sportProfileForm.heightCm);
    const weight = Number(sportProfileForm.currentWeightKg);
    const sportsAreValid = areSportFieldsValid(sportProfileForm);
    const supplementsAreValid = areSupplementFieldsValid(sportProfileForm);
    const injuriesAreValid = areInjuryFieldsValid(sportProfileForm);
    const medicalInformationIsValid = areMedicalFieldsValid(sportProfileForm);
    const sportCoreValuesAreValid = Boolean(
      height >= 80 &&
      height <= 260 &&
      Number.isInteger(height) &&
      weight >= 25 &&
      weight <= 350 &&
      isSportGoalFieldValid(sportProfileForm) &&
      sportsAreValid
    );
    const nextEmail = normalizeEmail(settingsForm.newEmail || "");
    const requestedEmail = isEmailConfirmAction ? nextEmail : "";
    const shouldUpdatePassword = isPasswordAction;
    const resolvedPhoneCountryCode = getCountryDialCode(settingsForm.country);
    const showSettingsError = (text) => {
      setSettingsFeedback({ type: "error", text });
      setAppToast({ type: "error", text });
    };

    if (isEmailConfirmAction && !nextEmail) {
      showSettingsError("Saisis une nouvelle adresse email avant de confirmer.");
      return;
    }

    if ((isProfileAction || isFullSettingsAction) && (!firstName || !lastName || !settingsForm.country)) {
      showSettingsError("Merci de remplir toutes les informations obligatoires du profil.");
      return;
    }

    if (isContactAction && !settingsForm.country) {
      showSettingsError("Choisis d’abord le pays de résidence pour enregistrer les coordonnées.");
      return;
    }

    if ((isSportProfileAction || isFullSettingsAction) && !sportCoreValuesAreValid) {
      showSettingsError("Merci de remplir toutes les informations obligatoires du profil sportif.");
      return;
    }

    if ((isNutritionAction || isFullSettingsAction) && !supplementsAreValid) {
      showSettingsError("Merci de compléter les informations obligatoires des compléments alimentaires.");
      return;
    }

    if ((isHealthAction || isFullSettingsAction) && (!injuriesAreValid || !medicalInformationIsValid)) {
      showSettingsError("Merci de compléter les informations obligatoires de santé.");
      return;
    }

    if (requestedEmail && !/^\S+@\S+\.\S+$/.test(requestedEmail)) {
      showSettingsError("Adresse email invalide.");
      return;
    }

    if (requestedEmail && requestedEmail === normalizeEmail(currentUser?.email || "")) {
      showSettingsError("Saisis une nouvelle adresse email différente de l’adresse actuelle.");
      return;
    }

    if (shouldUpdatePassword) {
      if (!settingsForm.currentPassword.trim()) {
        showSettingsError("Saisis ton mot de passe actuel avant de choisir un nouveau mot de passe.");
        return;
      }
      if (!settingsForm.newPassword.trim()) {
        showSettingsError("Saisis ton nouveau mot de passe.");
        return;
      }
      if (!isPasswordStrong(settingsForm.newPassword)) {
        showSettingsError("Le nouveau mot de passe ne respecte pas les conditions.");
        return;
      }
      if (settingsForm.newPassword !== settingsForm.confirmNewPassword) {
        showSettingsError("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    if (!currentUser?.id || (!currentUser?.accessToken && !currentUser?.refreshToken)) {
      showSettingsError("Connexion à actualiser. Reconnecte-toi puis réessaie.");
      return;
    }

    const savedSettingsForm = profileSettingsToForm(currentUser, sportProfile);
    const savedSportProfileForm = sportProfileToForm(sportProfile);
    const profileHasChanged = !areSameSettingsSnapshot(
      settingsProfileSnapshot(settingsForm),
      settingsProfileSnapshot(savedSettingsForm)
    );
    const contactHasChanged = !areSameSettingsSnapshot(
      settingsContactSnapshot(settingsForm),
      settingsContactSnapshot(savedSettingsForm)
    );
    const sportCoreHasChanged = !areSameSettingsSnapshot(
      sportCoreSnapshot(sportProfileForm),
      sportCoreSnapshot(savedSportProfileForm)
    );
    const nutritionHasChanged = !areSameSettingsSnapshot(
      nutritionSnapshot(sportProfileForm),
      nutritionSnapshot(savedSportProfileForm)
    );
    const healthHasChanged = !areSameSettingsSnapshot(
      healthSnapshot(sportProfileForm),
      healthSnapshot(savedSportProfileForm)
    );
    const hasAnySettingsChange =
      profileHasChanged || contactHasChanged || sportCoreHasChanged || nutritionHasChanged || healthHasChanged || requestedEmail || shouldUpdatePassword;

    if (
      (isProfileAction && !profileHasChanged) ||
      (isContactAction && !contactHasChanged) ||
      (isSportProfileAction && !sportCoreHasChanged) ||
      (isNutritionAction && !nutritionHasChanged) ||
      (isHealthAction && !healthHasChanged) ||
      (isFullSettingsAction && !hasAnySettingsChange)
    ) {
      showSettingsError("Aucune modification détectée.");
      return;
    }

    setIsSettingsSaving(true);
    try {
      let sessionUser = await refreshCurrentUserSession();
      const dietarySupplements = sportProfileFormToSupplements(sportProfileForm);
      const injuryHistory = sportProfileFormToInjuries(sportProfileForm);
      const medicalInformation = sportProfileFormToMedicalInformation(sportProfileForm);
      const profilePayload = isCoachAccount
        ? settingsFormToProfilePayload(settingsForm)
        : {
            ...sportProfileFormToPayload(sportProfileForm),
            ...settingsFormToProfilePayload(settingsForm)
          };
      const emailChangeRedirectTo =
        typeof window !== "undefined"
          ? new URL("/dashboard?view=settings&email_change=confirmed", window.location.origin).toString()
          : "";
      const accountUpdatePayload = {
        metadata: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          country_code: settingsForm.country,
          avatar_url: settingsForm.avatarUrl.trim(),
          phone_number: settingsForm.phoneNumber.trim(),
          phone_country_code: resolvedPhoneCountryCode,
          phone_verified_at: settingsForm.phoneNumber.trim() ? settingsForm.phoneVerifiedAt || "" : "",
          address_line1: settingsForm.addressLine1.trim(),
          address_line2: settingsForm.addressLine2.trim(),
          postal_code: settingsForm.postalCode.trim(),
          city: settingsForm.city.trim(),
          region: settingsForm.region.trim(),
          has_no_supplement: Boolean(sportProfileForm.hasNoSupplement),
          dietary_supplements: dietarySupplements,
          has_no_injury: Boolean(sportProfileForm.hasNoInjury),
          injury_history: injuryHistory,
          has_no_medical_information: Boolean(sportProfileForm.hasNoMedicalInformation),
          medical_information: medicalInformation,
          sport_goal_custom: sportProfileForm.sportGoal === "other" ? sportProfileForm.sportGoalCustom.trim() : "",
          // Marque durablement le compte comme coach (reconnu côté serveur même après un changement d'email).
          ...(isCoachAccount ? { is_coach: true } : {})
        },
        profile: profilePayload,
        emailRedirectTo: emailChangeRedirectTo
      };

      if (requestedEmail && requestedEmail !== normalizeEmail(currentUser.email || "")) {
        accountUpdatePayload.newEmail = requestedEmail;
        window.localStorage.setItem("hm-pending-email-change", requestedEmail);
      }

      if (shouldUpdatePassword) {
        accountUpdatePayload.currentPassword = settingsForm.currentPassword;
        accountUpdatePayload.newPassword = settingsForm.newPassword;
      }

      let updatedAccount = { user: { email: currentUser.email } };
      let profileAccountSyncFailed = false;
      const isAccountUpdateCritical = requestedEmail || shouldUpdatePassword || !isProfileAction;

      try {
        updatedAccount = await callSupabaseFunctionWithAuth(
          "update-account-security",
          accountUpdatePayload,
          sessionUser.accessToken
        );
      } catch (accountUpdateError) {
        if (isAccountUpdateCritical) {
          throw accountUpdateError;
        }

        profileAccountSyncFailed = true;
        console.warn("Profile metadata sync skipped", accountUpdateError);
      }
      if (shouldUpdatePassword && updatedAccount?.passwordUpdated) {
        try {
          const reloginData = await callSupabaseFunction("auth-login", {
            email: currentUser.email,
            password: settingsForm.newPassword
          });

          sessionUser = {
            ...sessionUser,
            id: reloginData.user?.id || sessionUser.id,
            email: reloginData.user?.email || sessionUser.email,
            accessToken: reloginData.access_token || sessionUser.accessToken,
            refreshToken: reloginData.refresh_token || sessionUser.refreshToken
          };
        } catch (reauthError) {
          console.warn("Password changed, session refresh skipped", reauthError);
        }
      }
      let updatedProfile = updatedAccount?.profile ? normalizeSportProfile(updatedAccount.profile) : null;
      if (!updatedProfile && (isProfileAction || isCoachAccount)) {
        updatedProfile = normalizeSportProfile({
          ...sportProfile,
          ...settingsFormToProfilePayload(settingsForm),
          avatar_url: settingsForm.avatarUrl.trim()
        });
      }
      if (!updatedProfile) {
        try {
          updatedProfile = await updateSportProfile(sessionUser.id, sessionUser.accessToken, profilePayload);
        } catch (profileError) {
          const profileErrorText = String(profileError?.message || "").toLowerCase();
          const canRecoverAfterPasswordChange =
            shouldUpdatePassword &&
            (profileErrorText.includes("session") ||
              profileErrorText.includes("jwt") ||
              profileErrorText.includes("expired") ||
              profileErrorText.includes("invalid"));

          if (!canRecoverAfterPasswordChange) {
            throw profileError;
          }

          const reloginData = await callSupabaseFunction("auth-login", {
            email: currentUser.email,
            password: settingsForm.newPassword
          });

          sessionUser = {
            ...sessionUser,
            id: reloginData.user?.id || sessionUser.id,
            email: reloginData.user?.email || sessionUser.email,
            accessToken: reloginData.access_token || sessionUser.accessToken,
            refreshToken: reloginData.refresh_token || sessionUser.refreshToken
          };
          updatedProfile = await updateSportProfile(sessionUser.id, sessionUser.accessToken, profilePayload);
        }
      }
      updatedProfile = normalizeSportProfile({
        ...updatedProfile,
        has_no_supplement: Boolean(sportProfileForm.hasNoSupplement),
        dietary_supplements: dietarySupplements,
        has_no_injury: Boolean(sportProfileForm.hasNoInjury),
        injury_history: injuryHistory,
        has_no_medical_information: Boolean(sportProfileForm.hasNoMedicalInformation),
        medical_information: medicalInformation,
        sport_goal_custom: sportProfileForm.sportGoal === "other" ? sportProfileForm.sportGoalCustom.trim() : ""
      });
      const nextFullName = `${updatedProfile.first_name || firstName} ${updatedProfile.last_name || lastName}`.trim();

      setSportProfile(updatedProfile);
      setSportProfileForm(sportProfileToForm(updatedProfile));
      if (profileHasChanged && currentUser?.id) {
        setClientReviews((prev) =>
          prev.map((review) =>
            review.authorId === currentUser.id
              ? {
                ...review,
                authorName: nextFullName || review.authorName,
                avatarUrl: settingsForm.avatarUrl.trim() || review.avatarUrl
              }
              : review
          )
        );
      }
      setCurrentUser((prev) =>
        prev
          ? {
            ...prev,
            firstName: updatedProfile.first_name || firstName,
            lastName: updatedProfile.last_name || lastName,
            fullName: nextFullName || prev.fullName,
            email: requestedEmail ? prev.email : updatedAccount?.user?.email || prev.email,
            country: updatedProfile.country_code || settingsForm.country,
            sex: updatedProfile.sex || prev.sex || "",
            hasNoSupplement: updatedProfile.has_no_supplement,
            dietarySupplements: updatedProfile.dietary_supplements,
            hasNoInjury: updatedProfile.has_no_injury,
            injuryHistory: updatedProfile.injury_history,
            hasNoMedicalInformation: updatedProfile.has_no_medical_information,
            medicalInformation: updatedProfile.medical_information,
            avatarUrl: settingsForm.avatarUrl.trim(),
            phoneNumber: settingsForm.phoneNumber.trim(),
            phoneCountryCode: resolvedPhoneCountryCode,
            phoneVerifiedAt: settingsForm.phoneNumber.trim() ? settingsForm.phoneVerifiedAt || "" : "",
            addressLine1: settingsForm.addressLine1.trim(),
            addressLine2: settingsForm.addressLine2.trim(),
            postalCode: settingsForm.postalCode.trim(),
            city: settingsForm.city.trim(),
            region: settingsForm.region.trim(),
            accessToken: sessionUser.accessToken || prev.accessToken,
            refreshToken: sessionUser.refreshToken || prev.refreshToken,
            sportProfileCompleted: isSportProfileComplete(updatedProfile)
          }
          : prev
      );
      setSettingsForm((prev) => ({
        ...profileSettingsToForm(
          {
            ...currentUser,
            firstName: updatedProfile.first_name || firstName,
            lastName: updatedProfile.last_name || lastName,
            fullName: nextFullName || currentUser.fullName,
            email: requestedEmail ? currentUser.email : updatedAccount?.user?.email || sessionUser.email || currentUser.email,
            sex: updatedProfile.sex || currentUser.sex || "",
            avatarUrl: settingsForm.avatarUrl.trim(),
            phoneNumber: settingsForm.phoneNumber.trim(),
            phoneCountryCode: resolvedPhoneCountryCode,
            phoneVerifiedAt: settingsForm.phoneNumber.trim() ? settingsForm.phoneVerifiedAt || "" : "",
            addressLine1: settingsForm.addressLine1.trim(),
            addressLine2: settingsForm.addressLine2.trim(),
            postalCode: settingsForm.postalCode.trim(),
            city: settingsForm.city.trim(),
            region: settingsForm.region.trim()
          },
          updatedProfile
        ),
        newEmail: isEmailConfirmAction ? "" : prev.newEmail,
        currentPassword: isPasswordAction ? "" : prev.currentPassword,
        newPassword: isPasswordAction ? "" : prev.newPassword,
        confirmNewPassword: isPasswordAction ? "" : prev.confirmNewPassword
      }));
      const actionSuccessText =
        requestedEmail
          ? "Un lien de confirmation a été envoyé à votre nouvelle adresse email. Ouvrez votre boîte mail et cliquez sur le lien pour confirmer le changement."
          : shouldUpdatePassword
            ? "Mot de passe changé avec succès."
            : isProfileAction
              ? "Profil mis à jour avec succès."
              : isContactAction
                ? "Coordonnées mises à jour avec succès."
                : isSportProfileAction
                  ? "Profil sportif mis à jour avec succès."
                  : isNutritionAction
                    ? "Informations nutrition mises à jour avec succès."
                    : isHealthAction
                      ? "Informations de santé mises à jour avec succès."
                      : "Informations mises à jour avec succès.";
      setSettingsFeedback({
        type: "success",
        text: actionSuccessText
      });
      setAppToast({
        type: "success",
        text: actionSuccessText
      });
    } catch (error) {
      const errorMessage = String(error?.message || "");
      const errorCode = String(error?.code || "");
      const normalizedError = errorMessage.toLowerCase();
      if (requestedEmail) {
        window.localStorage.removeItem("hm-pending-email-change");
      }
      if (
        normalizedError.includes("session") ||
        normalizedError.includes("jwt") ||
        normalizedError.includes("expired")
      ) {
        setAppToast({ type: "error", text: "Connexion à actualiser. Aucun changement de page automatique." });
      }
      const settingsErrorText =
        errorCode === "CURRENT_PASSWORD_INVALID" || normalizedError.includes("mot de passe actuel incorrect")
          ? "Mot de passe actuel incorrect."
          : normalizedError.includes("failed to fetch")
            ? "Le service ne répond pas pour le moment. Réessaie dans un instant."
            : normalizedError.includes("jwt") || normalizedError.includes("expired")
              ? "Connexion à actualiser. Reconnecte-toi puis réessaie."
              : errorMessage && errorMessage !== "SUPABASE_REST_FAILED" && errorMessage !== "SUPABASE_FUNCTION_FAILED"
                ? errorMessage
                : "Impossible d’enregistrer les paramètres.";
      setSettingsFeedback({
        type: "error",
        text: settingsErrorText
      });
      setAppToast({ type: "error", text: settingsErrorText });
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.accessToken && !currentUser?.refreshToken) {
      setSettingsFeedback({ type: "error", text: "Connexion à actualiser. Reconnecte-toi." });
      return;
    }

    setIsSettingsSaving(true);
    setSettingsFeedback({ type: "", text: "" });
    try {
      const sessionUser = await refreshCurrentUserSession();
      await callSupabaseFunctionWithAuth("delete-account", {}, sessionUser.accessToken);
      setCurrentUser(null);
      setSportProfile(normalizeSportProfile());
      setSportProfileForm(emptySportProfileForm);
      setSettingsForm(emptySettingsForm);
      setAuthFeedback({ type: "success", text: "Compte supprimé." });
      navigateTo(authLoginRoute);
    } catch (error) {
      const errorMessage = String(error?.message || "");
      setSettingsFeedback({
        type: "error",
        text: errorMessage && errorMessage !== "SUPABASE_FUNCTION_FAILED" ? errorMessage : "Impossible de supprimer le compte."
      });
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const updateSportEntry = (index, patch) => {
    setSportProfileForm((prev) => ({
      ...prev,
      sports: prev.sports.map((sport, sportIndex) => (sportIndex === index ? { ...sport, ...patch } : sport))
    }));
  };

  const addSportEntry = () => {
    setSportProfileForm((prev) => ({
      ...prev,
      hasNoSport: false,
      sports: [...prev.sports, { ...emptySportEntry }]
    }));
  };

  const removeSportEntry = (index) => {
    setSportProfileForm((prev) => {
      const nextSports = prev.sports.filter((_, sportIndex) => sportIndex !== index);
      return {
        ...prev,
        hasNoSport: nextSports.length === 0 ? true : prev.hasNoSport,
        sports: nextSports.length ? nextSports : [{ ...emptySportEntry }]
      };
    });
  };

  const updateSupplementEntry = (index, patch) => {
    setSportProfileForm((prev) => ({
      ...prev,
      supplements: prev.supplements.map((supplement, supplementIndex) =>
        supplementIndex === index ? { ...supplement, ...patch } : supplement
      )
    }));
  };

  const addSupplementEntry = () => {
    setSportProfileForm((prev) => ({
      ...prev,
      hasNoSupplement: false,
      supplements: [...prev.supplements, { ...emptySupplementEntry }]
    }));
  };

  const removeSupplementEntry = (index) => {
    setSportProfileForm((prev) => {
      const nextSupplements = prev.supplements.filter((_, supplementIndex) => supplementIndex !== index);
      return {
        ...prev,
        hasNoSupplement: nextSupplements.length === 0 ? true : prev.hasNoSupplement,
        supplements: nextSupplements.length ? nextSupplements : [{ ...emptySupplementEntry }]
      };
    });
  };

  const updateInjuryEntry = (index, patch) => {
    setSportProfileForm((prev) => ({
      ...prev,
      injuryEntries: prev.injuryEntries.map((injury, injuryIndex) =>
        injuryIndex === index ? { ...injury, ...patch } : injury
      )
    }));
  };

  const addInjuryEntry = () => {
    setSportProfileForm((prev) => ({
      ...prev,
      hasNoInjury: false,
      injuryEntries: [...prev.injuryEntries, { ...emptyInjuryEntry }]
    }));
  };

  const removeInjuryEntry = (index) => {
    setSportProfileForm((prev) => {
      const nextInjuries = prev.injuryEntries.filter((_, injuryIndex) => injuryIndex !== index);
      return {
        ...prev,
        hasNoInjury: nextInjuries.length === 0 ? true : prev.hasNoInjury,
        injuryEntries: nextInjuries.length ? nextInjuries : [{ ...emptyInjuryEntry }]
      };
    });
  };

  const updateMedicalEntry = (index, patch) => {
    setSportProfileForm((prev) => ({
      ...prev,
      medicalEntries: prev.medicalEntries.map((medical, medicalIndex) =>
        medicalIndex === index ? { ...medical, ...patch } : medical
      )
    }));
  };

  const addMedicalEntry = () => {
    setSportProfileForm((prev) => ({
      ...prev,
      hasNoMedicalInformation: false,
      medicalEntries: [...prev.medicalEntries, { ...emptyMedicalEntry }]
    }));
  };

  const removeMedicalEntry = (index) => {
    setSportProfileForm((prev) => {
      const nextMedicalEntries = prev.medicalEntries.filter((_, medicalIndex) => medicalIndex !== index);
      return {
        ...prev,
        hasNoMedicalInformation: nextMedicalEntries.length === 0 ? true : prev.hasNoMedicalInformation,
        medicalEntries: nextMedicalEntries.length ? nextMedicalEntries : [{ ...emptyMedicalEntry }]
      };
    });
  };

  const handleLanguageChange = (code) => {
    if (code === language) {
      setIsLangMenuOpen(false);
      return;
    }
    setLanguage(code);
    setIsLangMenuOpen(false);
    setActiveNavSection("services");
  };

  const getNavLinkClass = (sectionId) =>
    `group relative inline-flex flex-col items-center pb-1 transition ${activeNavSection === sectionId ? "nav-link-active" : "hover:text-white"
    }`;

  const getNavIndicatorClass = (sectionId) =>
    `mt-1 h-0.5 w-full rounded-full transition ${activeNavSection === sectionId
      ? "nav-link-indicator-active"
      : "bg-transparent opacity-0 group-hover:bg-brand-300/70 group-hover:opacity-100"
    }`;
  const authInputClass =
    "auth-field mt-1.5 w-full rounded-xl border px-3 py-2 text-sm outline-none transition";
  const authSelectClass = authInputClass + " appearance-none";
  const getSportLevelLabel = (value) => profileText.levelOptions?.[value] || value || "-";
  const getSportGoalLabel = (value, customValue = "") =>
    value === "other" ? customValue || profileText.goalOptions?.other || "Autre" : profileText.goalOptions?.[value] || value || "-";
  const authHeader = (
    <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <nav className="intro-nav auth-nav flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-[0_12px_36px_rgba(2,8,23,0.5)] backdrop-blur-xl sm:px-6">
        <button type="button" onClick={() => navigateTo("/")} className="flex items-center gap-3 text-left">
          <img src={hmLogo} alt="Logo HM" className="h-11 w-11 rounded-xl border border-brand-300/60" />
          <div>
            <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.1em] text-brand-300 sm:text-[9px]">{content.nav.coachLabel}</p>
            <p className="font-display text-base font-bold tracking-wide text-white sm:text-lg"><BrandAppText /></p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300"
              aria-haspopup="menu"
              aria-expanded={isLangMenuOpen}
            >
              <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
              <span>{currentLanguageOption.label}</span>
            </button>

            {isLangMenuOpen ? (
              <div
                className={`absolute top-full z-30 mt-2 w-44 rounded-xl border border-slate-600/70 bg-slate-900/95 p-1.5 shadow-[0_12px_24px_rgba(2,8,23,0.45)] backdrop-blur ${isArabic ? "right-0" : "left-0"
                  }`}
                role="menu"
              >
                {Object.entries(languageOptions).map(([code, option]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLanguageChange(code)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${language === code
                        ? "bg-brand-500 text-slate-950"
                        : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
                      }`}
                    role="menuitem"
                  >
                    <span className="text-sm leading-none">{option.flag}</span>
                    <span className="min-w-8">{option.label}</span>
                    <span className={`text-[11px] ${language === code ? "text-slate-900/85" : "text-slate-400"}`}>
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300"
          >
            <span className="text-sm leading-none" aria-hidden="true">
              {isLight ? "☀️" : "🌙"}
            </span>
            <span>{isLight ? content.controls.lightMode : content.controls.darkMode}</span>
          </button>
        </div>
      </nav>
    </header>
  );

  const toastShellClass = appToast.text
    ? `relative flex w-[min(calc(100vw-2rem),420px)] items-start gap-3 overflow-hidden rounded-3xl border-2 px-4 py-3.5 text-sm shadow-[0_28px_90px_-18px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur-2xl ${appToast.type === "success"
      ? "border-brand-200 bg-[linear-gradient(135deg,rgba(21,128,61,0.98),rgba(2,6,23,0.96))] text-brand-100"
      : "border-red-200 bg-[linear-gradient(135deg,rgba(153,27,27,0.98),rgba(2,6,23,0.96))] text-red-100"
    }`
    : "";
  const toastContent = appToast.text ? (
    <>
      <span
        className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 ${appToast.type === "success"
            ? "border-brand-100/90 bg-brand-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.42)]"
            : "border-red-100/90 bg-red-500 text-white shadow-[0_0_34px_rgba(248,113,113,0.48)]"
          }`}
        aria-hidden="true"
      >
        {appToast.type === "success" ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current drop-shadow">
            <path d="m9.55 16.2-3.6-3.6-1.4 1.4 5 5L20 8.45l-1.4-1.4-9.05 9.15Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current drop-shadow">
            <path d="M12 2 1 21h22L12 2Zm1 15h-2v2h2v-2Zm0-8h-2v6h2V9Z" />
          </svg>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
          {appToast.type === "success" ? "Succès" : "Attention"}
        </p>
        <p className="mt-0.5 text-sm font-black leading-snug text-white">{appToast.text}</p>
      </div>
      <button
        type="button"
        onClick={() => setAppToast({ type: "", text: "" })}
        className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:border-white/25 hover:text-white"
        aria-label="Fermer la notification"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" />
        </svg>
      </button>
      <span
        className={`pointer-events-none absolute bottom-0 left-0 h-1 w-full ${appToast.type === "success" ? "bg-brand-300/70" : "bg-red-300/70"
          }`}
        aria-hidden="true"
      />
    </>
  ) : null;

  const globalCartNode = isGlobalCartOpen && typeof document !== "undefined"
    ? createPortal(
      <div
        className="fixed inset-0 z-[90] grid place-items-center p-4"
        style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        onClick={() => setIsGlobalCartOpen(false)}
      >
        <div
          className="flex max-h-[85vh] w-[min(100%,32rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-500" aria-hidden="true"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
              <h2 className="font-display text-lg font-black text-slate-900">Mon panier</h2>
            </div>
            <button type="button" onClick={() => setIsGlobalCartOpen(false)} aria-label="Fermer le panier" className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {globalCartItems.length ? (
              <ul className="space-y-3">
                {globalCartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.badge}</p>
                    </div>
                    <span className="shrink-0 text-sm font-black text-slate-900">{item.priceValue != null ? formatRegionalPrice(item.priceValue, isAlgeriaResident) : "Sur demande"}</span>
                    <button type="button" onClick={() => { removeFromGlobalCart(item.id); setIsGlobalCartOpen(false); setTimeout(() => setIsGlobalCartOpen(true), 50); }} aria-label="Retirer du panier" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-400 transition hover:border-rose-400 hover:text-rose-500">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <p className="font-display text-lg font-black text-slate-900">Votre panier est vide</p>
                <p className="mt-2 text-sm text-slate-500">Ajoutez des programmes payants pour les régler en une seule fois.</p>
              </div>
            )}
          </div>
          {globalCartItems.length ? (
            <div className="shrink-0 border-t border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Total</span>
                <span className="font-display text-2xl font-black text-slate-900">{formatRegionalPrice(globalCartTotal, isAlgeriaResident)}</span>
              </div>
              <button type="button" onClick={handleGlobalCheckout} className="mt-3 w-full rounded-2xl border-2 border-brand-300 bg-brand-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-brand-300">Payer {formatRegionalPrice(globalCartTotal, isAlgeriaResident)}</button>
            </div>
          ) : null}
        </div>
      </div>,
      document.body
    ) : null;

  const paymentChoiceEurTotal = paymentChoice.items.reduce((sum, id) => {
    const product = shopProducts.find((x) => x.id === id);
    const value = product ? parseProductPrice(product.price) : 0;
    return sum + (value || 0);
  }, 0);
  const paymentChoiceDzdTotal = Math.round(paymentChoiceEurTotal * 28);
  const closePaymentChoice = () => setPaymentChoice({ open: false, items: [], returnTo: "shop" });
  const paymentChoiceNode = paymentChoice.open && typeof document !== "undefined"
    ? createPortal(
      <div
        className="fixed inset-0 z-[95] grid place-items-center p-4"
        style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Choix du moyen de paiement"
        onClick={closePaymentChoice}
      >
        <div
          className="flex w-[min(100%,30rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2 className="font-display text-lg font-black text-slate-900">Choisis ton moyen de paiement</h2>
            <button type="button" onClick={closePaymentChoice} aria-label="Fermer" className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 transition hover:border-brand-400 hover:text-slate-900">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-col gap-3 px-5 py-5">
            <p className="text-sm text-slate-500">Résidence Algérie 🇩🇿 — paie par carte internationale ou par la poste locale (CCP).</p>
            <button
              type="button"
              onClick={() => { const items = paymentChoice.items; const returnTo = paymentChoice.returnTo; closePaymentChoice(); runStripeCheckout(items, returnTo); }}
              className="flex items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left transition hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span>
                <span>
                  <span className="block text-sm font-black text-slate-900">Carte bancaire / PayPal</span>
                  <span className="block text-xs text-slate-500">Paiement international sécurisé (Stripe)</span>
                </span>
              </span>
              <span className="shrink-0 text-sm font-black text-slate-900">{paymentChoiceEurTotal} €</span>
            </button>
            <button
              type="button"
              onClick={() => { const items = paymentChoice.items; const returnTo = paymentChoice.returnTo; closePaymentChoice(); runChargilyCheckout(items, returnTo); }}
              className="flex items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" /></svg></span>
                <span>
                  <span className="block text-sm font-black text-slate-900">CCP / EDAHABIA — Algérie Poste</span>
                  <span className="block text-xs text-slate-500">Paiement local en dinars (Chargily)</span>
                </span>
              </span>
              <span className="shrink-0 text-sm font-black text-slate-900">{paymentChoiceDzdTotal} DZD</span>
            </button>
          </div>
        </div>
      </div>,
      document.body
    ) : null;

  const appToastNode = appToast.text && typeof document !== "undefined"
    ? createPortal(
      <div
        className={`app-toast-right ${toastShellClass}`}
        dir="ltr"
        role={appToast.type === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {toastContent}
      </div>,
      document.body
    )
    : null;

  if (isCompleteProfilePage && currentUser) {
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {authHeader}
        <main className="relative z-10 mx-auto mt-6 flex h-[calc(100vh-164px)] max-w-5xl items-center overflow-hidden px-4 py-3 sm:px-6">
          <section className="reveal-up auth-glass-card mx-auto flex max-h-full min-h-0 w-full max-w-3xl flex-col overflow-hidden p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
              {profileText.required}
            </p>
            <h1 className="mt-2 font-display text-2xl font-black text-white md:text-3xl">
              {profileText.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{profileText.subtitle}</p>

            <form onSubmit={handleSportProfileSubmit} className="mt-4 flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="rounded-3xl border border-slate-600/45 bg-slate-950/25 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-black text-white">{profileText.physicalTitle}</h2>
                    <span className="rounded-full border border-brand-300/50 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
                      {profileText.required}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      <span>{profileText.heightCm}</span>
                      <input
                        type="number"
                        min="80"
                        max="260"
                        value={sportProfileForm.heightCm}
                        onKeyDown={preventInvalidNumberKey}
                        onChange={(event) =>
                          setSportProfileForm((prev) => ({
                            ...prev,
                            heightCm: sanitizePositiveNumberInput(event.target.value, { integer: true })
                          }))
                        }
                        className={authInputClass}
                        inputMode="numeric"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-slate-300">
                      <span>{profileText.currentWeightKg}</span>
                      <input
                        type="number"
                        min="25"
                        max="350"
                        step="0.1"
                        value={sportProfileForm.currentWeightKg}
                        onKeyDown={preventInvalidNumberKey}
                        onChange={(event) =>
                          setSportProfileForm((prev) => ({
                            ...prev,
                            currentWeightKg: sanitizePositiveNumberInput(event.target.value)
                          }))
                        }
                        className={authInputClass}
                        inputMode="decimal"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-600/45 bg-slate-950/25 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-black text-white">
                      {profileText.supplementsTitle || "3. Compléments alimentaires"}
                    </h2>
                    <span className="rounded-full border border-brand-300/50 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
                      {profileText.required}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-600/45 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={sportProfileForm.hasNoSupplement}
                        onChange={(event) =>
                          setSportProfileForm((prev) => ({
                            ...prev,
                            hasNoSupplement: event.target.checked,
                            supplements: event.target.checked ? [{ ...emptySupplementEntry }] : prev.supplements
                          }))
                        }
                        className="h-4 w-4 accent-emerald-400"
                      />
                      <span>{profileText.noSupplement || "Aucun complément alimentaire"}</span>
                    </label>

                    {!sportProfileForm.hasNoSupplement ? (
                      <div className="space-y-3">
                        {sportProfileForm.supplements.map((supplement, index) => (
                          <div
                            key={`supplement-entry-${index}`}
                            className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
                                {profileText.supplementNumber || "Complément"} {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeSupplementEntry(index)}
                                className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                              >
                                {profileText.removeSupplement || profileText.removeSport}
                              </button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <SelectWithOtherField
                                label={profileText.supplementName || "Nom du complément"}
                                value={supplement.name}
                                customValue={supplement.customName}
                                options={supplementNameOptions}
                                customPlaceholder={profileText.supplementCustomValue || "Précise"}
                                selectClass={authSelectClass}
                                onChange={(value) =>
                                  updateSupplementEntry(index, {
                                    name: value,
                                    customName: value === "Autre" ? supplement.customName : ""
                                  })
                                }
                                onCustomChange={(value) => updateSupplementEntry(index, { customName: value })}
                              />
                              <label className="block text-xs font-semibold text-slate-300">
                                <span>{profileText.supplementDose || "Dose / Quantité"}</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={supplement.dose}
                                  onKeyDown={preventInvalidNumberKey}
                                  onChange={(event) =>
                                    updateSupplementEntry(index, {
                                      dose: sanitizePositiveNumberInput(event.target.value, { maxDecimals: 2 })
                                    })
                                  }
                                  className={authInputClass}
                                  inputMode="decimal"
                                />
                              </label>
                              <SelectWithOtherField
                                label={profileText.supplementUnit || "Unité"}
                                value={supplement.unit}
                                customValue={supplement.customUnit}
                                options={supplementUnitOptions}
                                otherValue="autre"
                                customPlaceholder={profileText.supplementCustomValue || "Précise"}
                                selectClass={authSelectClass}
                                onChange={(value) =>
                                  updateSupplementEntry(index, {
                                    unit: value,
                                    customUnit: value === "autre" ? supplement.customUnit : ""
                                  })
                                }
                                onCustomChange={(value) => updateSupplementEntry(index, { customUnit: value })}
                              />
                              <SelectWithOtherField
                                label={profileText.supplementFrequency || "Fréquence"}
                                value={supplement.frequency}
                                customValue={supplement.customFrequency}
                                options={supplementFrequencyOptions}
                                customPlaceholder={profileText.supplementCustomValue || "Précise"}
                                selectClass={authSelectClass}
                                onChange={(value) =>
                                  updateSupplementEntry(index, {
                                    frequency: value,
                                    customFrequency: value === "Autre" ? supplement.customFrequency : ""
                                  })
                                }
                                onCustomChange={(value) => updateSupplementEntry(index, { customFrequency: value })}
                              />
                              <SelectWithOtherField
                                label={profileText.supplementTiming || "Moment de prise"}
                                value={supplement.timing}
                                customValue={supplement.customTiming}
                                options={supplementTimingOptions}
                                customPlaceholder={profileText.supplementCustomValue || "Précise"}
                                selectClass={authSelectClass}
                                onChange={(value) =>
                                  updateSupplementEntry(index, {
                                    timing: value,
                                    customTiming: value === "Autre" ? supplement.customTiming : ""
                                  })
                                }
                                onCustomChange={(value) => updateSupplementEntry(index, { customTiming: value })}
                              />
                              <SelectWithOtherField
                                label={profileText.supplementCategory || "Catégorie"}
                                value={supplement.category}
                                customValue={supplement.customCategory}
                                options={supplementCategoryOptions}
                                customPlaceholder={profileText.supplementCustomValue || "Précise"}
                                selectClass={authSelectClass}
                                onChange={(value) =>
                                  updateSupplementEntry(index, {
                                    category: value,
                                    customCategory: value === "Autre" ? supplement.customCategory : ""
                                  })
                                }
                                onCustomChange={(value) => updateSupplementEntry(index, { customCategory: value })}
                              />
                              <label className="block text-xs font-semibold text-slate-300">
                                <span>
                                  {profileText.supplementStartDate || "Date de début"} ({profileText.optional})
                                </span>
                                <input
                                  type="date"
                                  value={supplement.startDate}
                                  onChange={(event) => updateSupplementEntry(index, { startDate: event.target.value })}
                                  className={authInputClass}
                                />
                              </label>
                              <label className="block text-xs font-semibold text-slate-300">
                                <StatusLabelWithInfo
                                  label={profileText.supplementStatus || "Statut"}
                                  help={profileText.supplementStatusHelp}
                                />
                                <select
                                  value={supplement.status}
                                  onChange={(event) => updateSupplementEntry(index, { status: event.target.value })}
                                  className={authSelectClass}
                                >
                                  {supplementStatusValues.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                                <span>{profileText.supplementRemark || "Remarque"} ({profileText.optional})</span>
                                <textarea
                                  value={supplement.remark}
                                  onChange={(event) => updateSupplementEntry(index, { remark: event.target.value })}
                                  placeholder={
                                    profileText.supplementRemarkPlaceholder ||
                                    "Exemple : à prendre avec de l’eau, après le repas ..."
                                  }
                                  className={`${authInputClass} min-h-[86px] resize-y`}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSupplementEntry}
                          className="rounded-xl border border-brand-300/70 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-200 transition hover:border-brand-200 hover:bg-brand-500/15"
                        >
                          {profileText.addSupplement || "Ajouter un complément"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-600/45 bg-slate-950/25 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-black text-white">{profileText.sportTitle}</h2>
                    <span className="rounded-full border border-brand-300/50 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
                      {profileText.required}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-600/45 bg-slate-950/30 p-3 text-xs font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={sportProfileForm.hasNoSport}
                        onChange={(event) =>
                          setSportProfileForm((prev) => ({
                            ...prev,
                            hasNoSport: event.target.checked,
                            sports: event.target.checked ? [{ ...emptySportEntry }] : prev.sports
                          }))
                        }
                        className="h-4 w-4 accent-emerald-400"
                      />
                      <span>{profileText.noSport}</span>
                    </label>

                    {!sportProfileForm.hasNoSport ? (
                      <div className="space-y-3">
                        {sportProfileForm.sports.map((sport, index) => (
                          <div key={`sport-entry-${index}`} className="rounded-2xl border border-slate-600/45 bg-slate-950/25 p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-200">
                                {profileText.sportNumber} {index + 1}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeSportEntry(index)}
                                className="rounded-lg border border-slate-600/70 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:border-red-300 hover:text-red-200"
                              >
                                {profileText.removeSport}
                              </button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                              <label className="block text-xs font-semibold text-slate-300">
                                <span>{profileText.sportPracticed}</span>
                                <input
                                  type="text"
                                  value={sport.sportPracticed}
                                  onChange={(event) => updateSportEntry(index, { sportPracticed: event.target.value })}
                                  className={authInputClass}
                                />
                              </label>
                              <label className="block text-xs font-semibold text-slate-300">
                                <span>{profileText.sessionsPerWeek}</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="21"
                                  value={sport.sessionsPerWeek}
                                  onKeyDown={preventInvalidNumberKey}
                                  onChange={(event) =>
                                    updateSportEntry(index, {
                                      sessionsPerWeek: sanitizePositiveNumberInput(event.target.value, { integer: true })
                                    })
                                  }
                                  className={authInputClass}
                                  inputMode="numeric"
                                />
                              </label>
                              <label className="block text-xs font-semibold text-slate-300">
                                <span>{profileText.sportLevel}</span>
                                <select
                                  value={sport.sportLevel}
                                  onChange={(event) => updateSportEntry(index, { sportLevel: event.target.value })}
                                  className={authSelectClass}
                                >
                                  <option value="">{profileText.sportLevel}</option>
                                  {sportLevelValues.map((value) => (
                                    <option key={value} value={value}>
                                      {getSportLevelLabel(value)}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSportEntry}
                          className="rounded-xl border border-brand-300/70 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-200 transition hover:border-brand-200 hover:bg-brand-500/15"
                        >
                          {profileText.addSport}
                        </button>
                      </div>
                    ) : null}

                    <SportGoalField
                      profileText={profileText}
                      sportProfileForm={sportProfileForm}
                      setSportProfileForm={setSportProfileForm}
                      authInputClass={authInputClass}
                      authSelectClass={authSelectClass}
                      getSportGoalLabel={getSportGoalLabel}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-600/45 bg-slate-950/25 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-black text-white">
                      {profileText.healthTitle || "Blessures et informations médicales"}
                    </h2>
                    <span className="rounded-full border border-brand-300/50 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
                      {profileText.required}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <HealthInformationEditor
                      profileText={profileText}
                      sportProfileForm={sportProfileForm}
                      setSportProfileForm={setSportProfileForm}
                      updateInjuryEntry={updateInjuryEntry}
                      addInjuryEntry={addInjuryEntry}
                      removeInjuryEntry={removeInjuryEntry}
                      updateMedicalEntry={updateMedicalEntry}
                      addMedicalEntry={addMedicalEntry}
                      removeMedicalEntry={removeMedicalEntry}
                      authInputClass={authInputClass}
                      authSelectClass={authSelectClass}
                    />

                    <label className="block text-xs font-semibold text-slate-300">
                      <span>{profileText.remarks} ({profileText.optional})</span>
                      <textarea
                        value={sportProfileForm.remarks}
                        onChange={(event) => setSportProfileForm((prev) => ({ ...prev, remarks: event.target.value }))}
                        className={`${authInputClass} min-h-[96px] resize-y`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSportProfileSaving || isSportProfileLoading}
                className="auth-submit mt-4 w-full shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSportProfileSaving ? profileText.saving : profileText.save}
              </button>
            </form>

            {sportProfileFeedback.text ? (
              <p className={`mt-3 text-xs ${sportProfileFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-500"}`}>
                {sportProfileFeedback.text}
              </p>
            ) : null}
          </section>
        </main>
      </div>
    );
  }

  if (currentRoute.path === "/carte-preview") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
        <div className="w-full max-w-3xl">
          <AthleteLuxuryCard
            language={language || "fr"}
            fullName="Mohamed Ali"
            matricule="HC-ATH-0001"
            email="mohamed.ali@example.com"
            birthDate="14/05/2002"
            country="France"
            registrationDate="02/05/2026"
            initials="MA"
            photoUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=600&auto=format&fit=crop"
          />
        </div>
      </div>
    );
  }

  if (isDashboardPage && currentUser) {
    const dashboardLocale = language === "en" ? "en" : language === "ar" ? "ar" : "fr";
    const athleteFirstName = sportProfile.first_name || currentUser.firstName || "";
    const athleteLastName = sportProfile.last_name || currentUser.lastName || "";
    const athleteDisplayName =
      formatPersonName(`${athleteFirstName} ${athleteLastName}`.trim() || currentUser.fullName) ||
      currentUser.email ||
      "Athlete";
    const athleteInitials = getNameInitials(athleteFirstName, athleteLastName, currentUser.fullName);
    const coachDisplayName = COACH_DISPLAY_NAME;
    const coachInitials = getInitials(COACH_DISPLAY_NAME);
    const athleteCountry =
      countryOptions.find((option) => option.code === sportProfile.country_code)?.name || sportProfile.country_code || "-";
    const athleteMatricule = getAthleteMatricule(currentUser.id);
    const registrationDate = formatDisplayDate(sportProfile.created_at, dashboardLocale);
    const birthDate = formatDisplayDate(sportProfile.date_of_birth, dashboardLocale);
    const weightSeries = buildWeightSeries(sportProfile.current_weight_kg, dashboardWeightRange);
    const objectiveChart = buildObjectiveSeries(sportProfile.sport_goal);
    const rangeOptions = [
      { value: "week", label: "Semaine" },
      { value: "month", label: "Mois" },
      { value: "year", label: "Année" }
    ];
    const dashLocaleTag = dashboardLocale === "en" ? "en-GB" : dashboardLocale === "ar" ? "ar-EG" : "fr-FR";
    // Prochain rendez-vous : le plus proche non annulé dont le créneau n'est pas encore terminé.
    const nextAppointmentRaw = (() => {
      if (typeof window === "undefined") return null;
      let list = [];
      try {
        const saved = window.localStorage.getItem("hm-appointments");
        const parsed = saved ? JSON.parse(saved) : [];
        list = Array.isArray(parsed) ? parsed : [];
      } catch {
        return null;
      }
      const nowMs = dashboardNow.getTime();
      return (
        list
          .filter(
            (a) =>
              a && !a.cancelled && a.date && a.time &&
              coachSlotInstant(a.date, a.time).getTime() + coachSlotDurationMin * 60000 > nowMs
          )
          .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0] || null
      );
    })();
    const nextAppointment = nextAppointmentRaw
      ? (() => {
          // Heure définie par le coach = heure d'Algérie → on l'affiche dans le fuseau local de l'athlète.
          const instant = coachSlotInstant(nextAppointmentRaw.date, nextAppointmentRaw.time);
          const wd = instant.toLocaleDateString(dashLocaleTag, { weekday: "long" });
          return {
            number: nextAppointmentRaw.number,
            dateMain: instant.toLocaleDateString(dashLocaleTag, { day: "2-digit", month: "short", year: "numeric" }),
            weekday: wd.charAt(0).toUpperCase() + wd.slice(1),
            timeStart: instant.toLocaleTimeString(dashLocaleTag, { hour: "2-digit", minute: "2-digit", hour12: false }),
            mode: nextAppointmentRaw.mode === "vocal" ? "Appel audio" : "Appel vidéo / audio",
            startsAt: instant.toISOString()
          };
        })()
      : null;
    const gmtOffsetH = -Math.round(new Date().getTimezoneOffset() / 60);
    const gmtLabel = `(GMT${gmtOffsetH >= 0 ? "+" : ""}${gmtOffsetH})`;
    const dashboardAppointmentStatus = getAppointmentStatus(nextAppointmentRaw, dashboardNow);
    const dashboardAppointmentCancellable = canCancelScheduledAppointment(nextAppointmentRaw, dashboardNow);
    // Bouton « Rejoindre » actif seulement à partir de 10 min avant et jusqu'à 10 min après l'heure.
    const canJoinAppointment = canJoinScheduledAppointment(nextAppointmentRaw, dashboardNow);
    const dashboardStatusBadge =
      dashboardAppointmentStatus === "confirmed"
        ? {
            cls: "bg-sky-100 text-sky-700",
            label: language === "en" ? "Confirmed" : language === "ar" ? "مؤكد" : "Confirmé"
          }
        : dashboardAppointmentStatus === "expired" || dashboardAppointmentStatus === "cancelled"
          ? {
              cls: "bg-rose-100 text-rose-700",
              label: language === "en" ? "Cancelled" : language === "ar" ? "ملغى" : "Annulé"
            }
          : {
              cls: "bg-amber-100 text-amber-700",
              label: language === "en" ? "Upcoming" : language === "ar" ? "قادم" : "À venir"
            };
    // Dernier programme envoyé par le coach (le plus récent).
    const lastProgram = coachPrograms
      .slice()
      .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())[0] || null;
    const dashHour = new Date().getHours();
    const welcomeGreeting =
      language === "en"
        ? dashHour < 12
          ? "Good morning"
          : dashHour < 18
            ? "Good afternoon"
            : "Good evening"
        : language === "ar"
          ? "مرحباً"
          : (dashHour >= 5 && dashHour < 18)
            ? "Bonjour"
            : "Bonsoir";
    const welcomeName = formatPersonName(athleteFirstName) || athleteDisplayName;
    const dashboardCartCount = (() => {
      if (typeof window === "undefined") return 0;
      try {
        const saved = window.localStorage.getItem("hm-shop-cart");
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        return 0;
      }
    })();

    return (
      <div
        className={`auth-page auth-page--dashboard auth-page--dashboard-wrap page-enter relative ${isLight ? "theme-light" : "theme-dark"} ${sidebarOpen ? "hf-sidebar-open" : "hf-sidebar-collapsed"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {appToastNode}
        {globalCartNode}
        {paymentChoiceNode}
        {dashCancelOpen && nextAppointment && dashboardAppointmentCancellable && typeof document !== "undefined"
          ? createPortal(
              <div
                className="fixed inset-0 z-[97] grid place-items-center p-4"
                style={{ background: "rgba(2,6,23,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                role="dialog"
                aria-modal="true"
                aria-label="Confirmer l'annulation"
                onClick={() => setDashCancelOpen(false)}
              >
                <div className="w-[min(100%,28rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(2,6,23,0.25)]" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-black text-slate-900">
                        {language === "en" ? "Cancel appointment?" : "Annuler le rendez-vous ?"}
                      </h2>
                      <p className="text-xs font-bold text-slate-500">
                        {language === "en" ? "with Coach Hicham" : "avec Coach Hicham"}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-slate-600">
                      {language === "en" ? "Do you really want to cancel your appointment on " : "Voulez-vous vraiment annuler votre rendez-vous du "}
                      <span className="font-black capitalize text-slate-900">{nextAppointment.dateMain}</span>
                      {language === "en" ? " at " : " à "}
                      <span className="font-black text-slate-900">{nextAppointment.timeStart}</span> ?
                    </p>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
                    <button type="button" onClick={() => setDashCancelOpen(false)} className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-400">
                      {language === "en" ? "Back" : "Retour"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          nextAppointmentRaw &&
                          canCancelScheduledAppointment(nextAppointmentRaw, new Date()) &&
                          typeof window !== "undefined"
                        ) {
                          try {
                            const saved = window.localStorage.getItem("hm-appointments");
                            const list = saved ? JSON.parse(saved) : [];
                            const updated = list.map((a) => (a && a.number === nextAppointmentRaw.number ? { ...a, cancelled: true } : a));
                            window.localStorage.setItem("hm-appointments", JSON.stringify(updated));
                            setDashCancelOpen(false);
                            window.location.reload();
                          } catch {
                            setDashCancelOpen(false);
                          }
                        } else {
                          setDashCancelOpen(false);
                        }
                      }}
                      className="flex-1 rounded-2xl border-2 border-rose-400 bg-rose-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-rose-600"
                    >
                      {language === "en" ? "Confirm cancellation" : "Confirmer l'annulation"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}
        <DashboardSidebar
          language={language}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          activeKey={activeNavKey}
          onNavigate={(key) => {
            setActiveNavKey(key);
            navigateTo(key === "dashboard" ? "/dashboard" : `/dashboard?view=${encodeURIComponent(key)}`);
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
          onLogout={handleLogout}
          isLight={isLight}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          onLanguageChange={(code) => {
            handleLanguageChange(code);
          }}
          currentLanguageOption={currentLanguageOption}
          languageOptions={languageOptions}
          isLangMenuOpen={isLangMenuOpen}
          onToggleLangMenu={() => setIsLangMenuOpen((v) => !v)}
          athleteName={isCoachAccount ? coachDisplayName : athleteDisplayName}
          athleteSubtitle={currentUser.email}
          athleteAvatarUrl={currentUser.avatarUrl}
          athleteInitials={isCoachAccount ? coachInitials : athleteInitials}
          isCoach={isCoachAccount}
        />
        {!sidebarOpen ? null : (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
            className="hf-sidebar-overlay"
          />
        )}
        {!sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="hf-mobile-menu-fab"
            data-testid="sidebar-mobile-fab"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Menu
          </button>
        ) : null}
        <main className="hf-dashboard-main relative z-10 mx-auto flex min-h-0 w-full max-w-[1700px] flex-1 flex-col overflow-hidden px-1.5 pb-1.5 pt-0 sm:px-2">
          {activeNavKey === "settings" ? (
            <SettingsPage
              isCoach={isCoachAccount}
              coachContent={isCoachAccount ? (
                <CoachContactsEditor
                  contacts={siteContacts}
                  onSaved={setSiteContacts}
                  onToast={(t) => setAppToast(t)}
                  refreshSession={refreshCurrentUserSession}
                  authInputClass={authInputClass}
                  authSelectClass={authSelectClass}
                />
              ) : null}
              currentUser={currentUser}
              athleteSex={sportProfile.sex || currentUser.sex || ""}
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              settingsFeedback={settingsFeedback}
              setSettingsFeedback={setSettingsFeedback}
              isSettingsSaving={isSettingsSaving}
              onSubmit={handleSettingsSubmit}
              onBack={() => {
                setActiveNavKey("dashboard");
                navigateTo("/");
              }}
              onGoToShop={() => setIsGlobalCartOpen(true)}
              onDeleteAccount={handleDeleteAccount}
              onAvatarFileChange={handleAvatarFileChange}
              countryOptions={countryOptions}
              sportProfileForm={sportProfileForm}
              setSportProfileForm={setSportProfileForm}
              updateSportEntry={updateSportEntry}
              addSportEntry={addSportEntry}
              removeSportEntry={removeSportEntry}
              updateSupplementEntry={updateSupplementEntry}
              addSupplementEntry={addSupplementEntry}
              removeSupplementEntry={removeSupplementEntry}
              updateInjuryEntry={updateInjuryEntry}
              addInjuryEntry={addInjuryEntry}
              removeInjuryEntry={removeInjuryEntry}
              updateMedicalEntry={updateMedicalEntry}
              addMedicalEntry={addMedicalEntry}
              removeMedicalEntry={removeMedicalEntry}
              profileText={profileText}
              getSportLevelLabel={getSportLevelLabel}
              getSportGoalLabel={getSportGoalLabel}
              authInputClass={authInputClass}
              authSelectClass={authSelectClass}
              preventInvalidNumberKey={preventInvalidNumberKey}
              sanitizePositiveNumberInput={sanitizePositiveNumberInput}
              settingsPasswordChecks={settingsPasswordChecks}
            />
          ) : activeNavKey === "exercises" ? (
            <ExercisesPage
              onBack={() => navigateTo("/")}
              onGoToShop={() => setIsGlobalCartOpen(true)}
            />
          ) : activeNavKey === "programs" ? (
            <MyProgramsPage
              onBack={() => navigateTo("/")}
              refreshSession={refreshCurrentUserSession}
              onInvoiceSent={() => setAppToast({ type: "success", text: "Votre facture a été envoyée à votre boîte email" })}
              onGoToShop={() => setIsGlobalCartOpen(true)}
              onPaidCheckout={startPaidCheckout}
            />
          ) : activeNavKey === "appointments" ? (
            <AppointmentsPage
              onBack={() => navigateTo("/")}
              customerEmail={currentUser.email || ""}
              onGoToShop={() => setIsGlobalCartOpen(true)}
            />
          ) : activeNavKey === "comments" && isCoachAccount ? (
            <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="settings-scroll mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                <CoachReviewsPage
                  reviews={clientReviews}
                  onChanged={setClientReviews}
                  refreshSession={refreshCurrentUserSession}
                  onToast={(t) => setAppToast(t)}
                  authInputClass={authInputClass}
                  authSelectClass={authSelectClass}
                />
              </div>
            </section>
          ) : activeNavKey === "shop" ? (
            <ShopPage
              searchValue={shopSearch}
              onSearchChange={setShopSearch}
              category={shopCategory}
              onCategoryChange={setShopCategory}
              priceType={shopPriceType}
              onPriceTypeChange={setShopPriceType}
              onBack={() => navigateTo("/")}
              customerName={currentUser.fullName || currentUser.firstName || ""}
              customerEmail={currentUser.email || ""}
              accessToken={currentUser.accessToken || ""}
              refreshSession={refreshCurrentUserSession}
              onInvoiceSent={() => setAppToast({ type: "success", text: "Votre facture a été envoyée à votre boîte email" })}
              onPaidCheckout={startPaidCheckout}
              isAlgeria={isAlgeriaResident}
            />
          ) : (
            <section className="settings-page flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="settings-hero shrink-0">
                <div className="settings-hero__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="9" rx="1.5" />
                    <rect x="14" y="3" width="7" height="5" rx="1.5" />
                    <rect x="14" y="12" width="7" height="9" rx="1.5" />
                    <rect x="3" y="16" width="7" height="5" rx="1.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="settings-hero__title">Tableau de bord</h1>
                  <p className="settings-hero__subtitle">
                    <span className="font-bold">{welcomeGreeting} <span className="capitalize">{welcomeName}</span></span> 👋{" "}
                    {language === "en"
                      ? "Here's your fitness tracking space."
                      : language === "ar"
                        ? "هذه مساحتك لمتابعة لياقتك الرياضية."
                        : "Voici ton espace de suivi sportif."}
                  </p>
                </div>
                <div className="settings-hero__actions" aria-label="Actions rapides">
                  <button
                    type="button"
                    onClick={() => navigateTo("/")}
                    className="settings-hero__back"
                    aria-label="Revenir en arrière"
                    title="Revenir en arrière"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 18 9 12l6-6" />
                      <path d="M9 12h11" />
                    </svg>
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGlobalCartOpen(true)}
                    className="settings-hero__action"
                    aria-label="Panier"
                    title="Voir le panier (boutique)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    {dashboardCartCount > 0 ? (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black text-white">
                        {dashboardCartCount}
                      </span>
                    ) : null}
                  </button>
                  <CoachInbox />
                </div>
              </div>

              <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1 overflow-hidden pr-0">
                <DashboardAdCarousel firstName={welcomeName} go={(view) => { setActiveNavKey(view); navigateTo(`/dashboard?view=${view}`); }} />
                <div className="mt-1 flex shrink-0 flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-2">
                <div className="athlete-card-stage flex min-w-0 shrink-0 justify-center lg:justify-start">
                  <AthleteLuxuryCard
                    language={language}
                    fullName={athleteDisplayName}
                    matricule={athleteMatricule}
                    email={currentUser.email}
                    birthDate={birthDate}
                    country={athleteCountry}
                    registrationDate={registrationDate}
                    initials={athleteInitials}
                    photoUrl={currentUser.avatarUrl}
                  />
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 lg:grid-cols-1 lg:gap-1">
                  {[
                    {
                      label:
                        language === "en" ? "Current weight" : language === "ar" ? "الوزن الحالي" : "Poids actuel",
                      value: sportProfile.current_weight_kg ? `${sportProfile.current_weight_kg} kg` : "—",
                      iconSrc: "/icones statistiques/poids.png",
                      iconClass: "stat-icon--poids",
                      watermark: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M8.5 8h7" /><circle cx="12" cy="13" r="2.2" /><path d="M12 11.2l1.4-1.1" /></svg>)
                    },
                    {
                      label:
                        language === "en" ? "Current height" : language === "ar" ? "الطول الحالي" : "Taille actuelle",
                      value: sportProfile.height_cm ? `${sportProfile.height_cm} cm` : "—",
                      iconSrc: "/icones statistiques/taille.png",
                      iconClass: "stat-icon--taille",
                      watermark: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="5" r="2" /><path d="M8 7.5v6.5M5 10.5h6M8 14l-2 5M8 14l2 5" /><path d="M18 3v18M18 6h2.5M18 10h2.5M18 14h2.5M18 18h2.5" /></svg>)
                    },
                    {
                      label:
                        language === "en"
                          ? "Sport goal"
                          : language === "ar"
                            ? "الهدف الرياضي"
                            : "Objectif sportif",
                      value: getSportGoalLabel(sportProfile.sport_goal, sportProfile.sport_goal_custom),
                      iconSrc: "/icones statistiques/objectif.png",
                      iconClass: "stat-icon--objectif",
                      watermark: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="13" r="7.5" /><circle cx="11" cy="13" r="4" /><circle cx="11" cy="13" r="0.8" /><path d="M11 13l7.5-7.5M15.5 4.5h4v4" /></svg>)
                    }
                  ].map(({ label, value, iconSrc, iconClass, watermark }) => {
                    const m = String(value).match(/^(\d[\d.,]*)\s*(.*)$/);
                    return (
                    <article key={label} className="dashboard-stat-card dashboard-stat-card--profile">
                      <div className="dashboard-stat-icon" aria-hidden="true">
                        {iconClass === "stat-icon--poids" ? (
                          <span className="stat-icon--poids-crop" style={{ backgroundImage: `url("${iconSrc}")` }} />
                        ) : (
                          <img src={iconSrc} className={iconClass} alt="" loading="lazy" />
                        )}
                      </div>
                      <div className="dashboard-stat-card__content">
                        <p className="dashboard-stat-card__label">{label}</p>
                        <p className="dashboard-stat-card__value">
                          {m && m[2]
                            ? (<><span className="dashboard-stat-card__num">{m[1]}</span> <span className="dashboard-stat-card__unit">{m[2]}</span></>)
                            : value}
                        </p>
                      </div>
                      <div className="dashboard-stat-card__deco" aria-hidden="true">{watermark}</div>
                    </article>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-row-appo-program flex min-h-0 flex-1 flex-col gap-1 overflow-hidden lg:flex-row lg:items-stretch lg:gap-2">
                <article className="auth-glass-card dashboard-next-appointment-card group relative flex min-h-0 w-full flex-col justify-start overflow-hidden px-2 pb-1.5 pt-1.5 md:px-2.5 md:pb-2 md:pt-1.5 lg:h-full lg:w-[clamp(22rem,36vw,31.25rem)]">
                  <div className="pointer-events-none absolute -left-12 -top-12 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl" aria-hidden />
                  <div className="pointer-events-none absolute -bottom-14 -right-10 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl" aria-hidden />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                        {language === "en" ? "Appointment" : language === "ar" ? "موعد" : "Rendez-vous"}
                      </p>
                      <h2 className="mt-0.5 font-display text-sm font-black text-white">
                        {language === "en" ? "Next appointment" : language === "ar" ? "الموعد القادم" : "Prochain rendez-vous"}
                      </h2>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-300/50 bg-gradient-to-br from-brand-400/40 to-emerald-500/25 text-white shadow-[0_6px_18px_-6px_rgba(20,184,111,0.7)]">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                  </div>
                  <div className="dashboard-rdv-bar relative z-10 mt-2 grid grid-cols-5 items-stretch rounded-2xl border border-slate-200 bg-white px-0.5 py-2 shadow-sm">
                    {[
                      {
                        label: language === "en" ? "Appt. #" : language === "ar" ? "رقم الموعد" : "N° RDV",
                        value: nextAppointment?.number || "—",
                        strong: true,
                        icon: (<svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>)
                      },
                      {
                        label: language === "en" ? "Date" : language === "ar" ? "التاريخ" : "Date",
                        value: nextAppointment?.dateMain || "—",
                        sub: nextAppointment?.weekday || null,
                        icon: (<svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>)
                      },
                      {
                        label: language === "en" ? "Time" : language === "ar" ? "الوقت" : "Heure",
                        value: nextAppointment?.timeStart || "—",
                        sub: nextAppointment ? gmtLabel : null,
                        icon: (<svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></svg>)
                      },
                      {
                        label: language === "en" ? "Mode" : language === "ar" ? "الوضع" : "Mode",
                        value: nextAppointment?.mode || "—",
                        icon: (<svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 10.5 20 7v10l-5-3.5" /><rect x="3" y="6" width="12" height="12" rx="2" /></svg>)
                      },
                      { label: language === "en" ? "Status" : language === "ar" ? "الحالة" : "Statut", badge: true }
                    ].map((col, idx) => (
                      <div key={col.label} className={`flex min-w-0 flex-col items-center justify-start gap-0.5 px-0.5 text-center ${idx > 0 ? "border-l border-slate-200" : ""}`}>
                        <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400">{col.label}</span>
                        {col.badge ? (
                          <span className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[8.5px] font-black ${dashboardStatusBadge.cls}`}>
                            {dashboardStatusBadge.label}
                          </span>
                        ) : (
                          <>
                            <span className={`flex max-w-full items-center justify-center gap-0.5 text-[9px] font-black leading-tight ${col.strong ? "text-emerald-600" : "text-slate-800"}`}>
                              {col.icon}
                              <span className="truncate">{col.value}</span>
                            </span>
                            {col.sub ? <span className="text-[7px] leading-none text-slate-400">{col.sub}</span> : null}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="relative z-10 mt-auto grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!canJoinAppointment}
                      onClick={() => {
                        setActiveNavKey("appointments");
                        navigateTo("/dashboard?view=appointments");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-2 py-2 text-[11px] font-black text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.8)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M15 10.5 20 7v10l-5-3.5" /><rect x="3" y="6" width="12" height="12" rx="2" />
                      </svg>
                      {language === "en" ? "Join call" : language === "ar" ? "انضم للمكالمة" : "Rejoindre l'appel"}
                    </button>
                    <button
                      type="button"
                      disabled={!dashboardAppointmentCancellable}
                      onClick={() => {
                        if (dashboardAppointmentCancellable) setDashCancelOpen(true);
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-black transition disabled:cursor-not-allowed ${
                        dashboardAppointmentCancellable
                          ? "border-red-300 bg-white text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                          : "border-slate-200 bg-slate-100 text-slate-400"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
                      </svg>
                      {language === "en" ? "Cancel" : language === "ar" ? "إلغاء" : "Annuler"}
                    </button>
                  </div>
                  <p className="relative z-10 mt-1.5 text-center text-[8.5px] leading-tight text-slate-400">
                    {language === "en"
                      ? "You can join the call 10 min before your appointment."
                      : language === "ar"
                        ? "يمكنك الانضمام للمكالمة قبل 10 دقائق من موعدك."
                        : "Vous pouvez rejoindre l'appel 10 min avant votre rendez-vous."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNavKey("appointments");
                      navigateTo("/dashboard?view=appointments");
                    }}
                    className="relative z-10 mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-transparent px-2 py-2 text-[11px] font-black text-emerald-600 transition hover:border-emerald-600 hover:bg-emerald-50/70 hover:text-emerald-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                      <path d="M8 15h8M8 18h5" />
                    </svg>
                    {language === "en" ? "Open my appointments" : language === "ar" ? "مواعيدي" : "Accéder à mes rendez-vous"}
                  </button>
                </article>

                <article className="auth-glass-card dashboard-last-program-card group relative flex min-w-0 flex-1 flex-col justify-start overflow-hidden px-2 pb-1.5 pt-1.5 md:px-2.5 md:pb-2 md:pt-1.5">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl" aria-hidden />
                  <div className="dashboard-last-program-card__header relative z-10 flex shrink-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                        {language === "en" ? "Program" : language === "ar" ? "البرنامج" : "Programme"}
                      </p>
                      <h2 className="mt-0.5 font-display text-sm font-black text-white">
                        {language === "en" ? "Last program sent" : language === "ar" ? "آخر برنامج مُرسَل" : "Dernier programme envoyé"}
                      </h2>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-300/50 bg-gradient-to-br from-brand-400/40 to-emerald-500/25 text-white shadow-[0_6px_18px_-6px_rgba(20,184,111,0.7)]">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
                        <path d="M8 7h8M8 11h8M8 15h5" />
                      </svg>
                    </span>
                  </div>
                  {lastProgram ? (
                    <div className="dashboard-last-program-card__body relative z-10 mt-2 border-t border-white/10 pt-2">
                      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-slate-950/30 p-1.5">
                        <div className="prog-card__icon relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
                            <path d="M14 2v6h6M9 13h6M9 17h4" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-xs font-black text-white">{lastProgram.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded-md border border-white/12 bg-slate-950/40 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-200">
                              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-brand-200" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                              </svg>
                              {new Date(`${lastProgram.sentDate}T00:00:00`).toLocaleDateString(dashLocaleTag, { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <span className={`rounded-md px-1.5 py-0.5 text-[8.5px] font-black ${lastProgram.priceType === "Gratuit" ? "prog-badge--free" : "prog-badge--paid"}`}>
                              {lastProgram.priceType}
                            </span>
                            <span className="rounded-md border border-white/12 bg-slate-950/40 px-1.5 py-0.5 text-[8.5px] font-black text-slate-300">
                              {lastProgram.number}
                            </span>
                          </div>
                          {lastProgram.remark ? (
                            <p className="mt-1 line-clamp-2 text-[9px] italic leading-snug text-slate-300/90">“{lastProgram.remark}”</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="dashboard-last-program-card__body relative z-10 mt-2 border-t border-white/10 pt-2">
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/30 p-2.5">
                        <div className="pointer-events-none absolute -right-3 -top-3 opacity-[0.12]">
                          <svg viewBox="0 0 24 24" className="h-16 w-16 text-brand-200" aria-hidden>
                            <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z" />
                          </svg>
                        </div>
                        <p className="relative text-xs font-black text-white">
                          {language === "en" ? "No program yet" : language === "ar" ? "لا يوجد برنامج بعد" : "Aucun programme pour le moment"}
                        </p>
                        <p className="relative mt-1 max-w-sm text-[10px] leading-snug text-slate-300">
                          {language === "en"
                            ? "Your coach will send your program soon."
                            : language === "ar"
                              ? "سيرسل لك مدربك برنامجك قريباً."
                              : "Votre coach Hicham vous enverra un programme prochainement."}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNavKey("programs");
                      navigateTo("/dashboard?view=programs");
                    }}
                    className="dashboard-outline-program-btn dashboard-last-program-card__program-btn relative z-10 mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-transparent px-2 py-2 text-[11px] font-black text-emerald-600 transition hover:border-emerald-600 hover:bg-emerald-50/70 hover:text-emerald-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
                      <path d="M8 7h8M8 11h8M8 15h5" />
                    </svg>
                    {language === "en" ? "Open my programs" : language === "ar" ? "برامجي" : "Accéder à mes programmes"}
                  </button>
                </article>
              </div>
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  if (isAuthConfirmationPage) {
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {authHeader}
        <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-12 sm:px-6">
          <section className="auth-glass-card w-full max-w-2xl p-8 text-center md:p-10">
            <div className="mx-auto mb-4 flex justify-center">
              <span className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] sm:h-[88px] sm:w-[88px]">
                <img
                  src="/Succes%202.gif"
                  alt=""
                  aria-hidden="true"
                  className="h-[74px] w-[74px] object-contain sm:h-[84px] sm:w-[84px]"
                />
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-white md:text-4xl">{authText.accountCreatedTitle}</h1>
            <p className="mt-3 text-slate-300">{authText.accountCreatedSubtitle}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAuthConfirmation(false);
                  setAuthMode("login");
                  setAuthFeedback({ type: "success", text: authText.accountReadyLogin });
                  navigateTo(authLoginRoute);
                }}
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-brand-400"
              >
                {authText.accountCreatedAction}
              </button>
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="rounded-xl border border-slate-500/75 bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-brand-300"
              >
                {content.contact.backTop}
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (isAuthResetPage) {
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {authHeader}
        <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-12 sm:px-6">
          <section className="auth-glass-card w-full max-w-2xl p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">{authText.title}</p>
            <h1 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">{authText.resetTab}</h1>
            <p className="mt-3 text-slate-200">{authText.resetSubtitle}</p>
            <p className="mt-3 rounded-2xl border border-brand-300/25 bg-slate-950/45 px-4 py-3 text-sm font-medium text-slate-200">
              {authText.passwordRule}
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="mt-6 space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                    <path d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7h14v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z" />
                  </svg>
                  <span>{authText.password}</span>
                </span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                  className={authInputClass}
                  placeholder={authText.passwordPlaceholder}
                  autoComplete="new-password"
                />
              </label>

              <PasswordRequirements checks={passwordChecks} labels={authText.passwordRequirements} />

              <label className="block text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                    <path d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7h14v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z" />
                  </svg>
                  <span>{authText.confirmPassword}</span>
                </span>
                <input
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  className={authInputClass}
                  placeholder={authText.confirmPasswordPlaceholder}
                  autoComplete="new-password"
                />
              </label>

              <button
                type="submit"
                className="auth-submit w-full rounded-xl px-4 py-2.5 text-sm font-bold transition"
              >
                {authText.resetButton}
              </button>
            </form>

            {authFeedback.text ? (
              <p className={`mt-4 text-xs ${authFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-500"}`}>
                {authFeedback.text}
              </p>
            ) : null}
          </section>
        </main>
      </div>
    );
  }

  if (isAuthResetCodePage) {
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {authHeader}
        <main className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-12 sm:px-6">
          <section className="auth-glass-card w-full max-w-2xl p-7 md:p-8">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-brand-300/70 bg-brand-500/15 text-brand-200">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
                <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 3a1 1 0 0 0-1 1v3.38l-1.7 1.69a1 1 0 1 0 1.4 1.42l2-2A1 1 0 0 0 13 12V8a1 1 0 0 0-1-1Zm-3.5 8a1 1 0 0 0 0 2h7a1 1 0 1 0 0-2h-7Z" />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">{authText.title}</p>
            <h1 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">{authText.resetCodeTab}</h1>
            <p className="mt-3 text-slate-200">{authText.resetCodeSubtitle}</p>
            <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-300/35 bg-brand-500/10 px-3 py-1.5 text-sm font-semibold text-brand-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm2 .4v.2l6 3.9 6-3.9V6.4a.4.4 0 0 0-.4-.4H6.4a.4.4 0 0 0-.4.4Zm12 2.3-5.6 3.6a1 1 0 0 1-1.1 0L6 8.7V17.6c0 .2.2.4.4.4h11.2c.2 0 .4-.2.4-.4V8.7Z" /></svg>
              <span className="truncate">{pendingMailboxEmail}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-300/25 bg-slate-950/45 px-4 py-3 text-sm">
              <p className="flex items-center gap-2 font-medium text-slate-200">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></svg>
                {authText.resetCodeCountdown}
              </p>
              <p className="rounded-lg bg-brand-500/20 px-2.5 py-1 font-black tabular-nums text-brand-100">{resetCodeCountdownLabel}</p>
            </div>

            <form onSubmit={handleVerifyResetCode} className="mt-6 space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                    <path d="M7 4a3 3 0 0 0-3 3v3h2V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3h2V7a3 3 0 0 0-3-3H7Zm-1 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H6Zm3 2h2v4H9v-4Zm4 0h2v4h-2v-4Z" />
                  </svg>
                  <span>{authText.resetCodeLabel}</span>
                </span>
                <input
                  type="text"
                  value={resetVerificationCode}
                  onChange={(event) =>
                    setResetVerificationCode(event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))
                  }
                  className="auth-field mt-2 w-full rounded-xl border px-3.5 py-2 text-base font-bold uppercase tracking-[0.12em] outline-none transition placeholder:font-semibold placeholder:normal-case placeholder:tracking-normal"
                  placeholder={authText.resetCodePlaceholder}
                  autoComplete="one-time-code"
                  inputMode="text"
                  maxLength={6}
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-black text-slate-950 shadow-[0_10px_26px_-10px_rgba(16,185,129,0.85)] transition hover:bg-brand-400 sm:col-span-2"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {authText.resetCodeButton}
                </button>
                <button
                  type="button"
                  onClick={handleResendResetCode}
                  disabled={resetCodeSecondsLeft > 0}
                  className={`min-w-0 rounded-lg px-4 py-2 text-center text-xs font-semibold leading-snug transition ${resetCodeSecondsLeft > 0
                      ? "cursor-not-allowed border border-slate-700/60 bg-slate-900/45 text-slate-500"
                      : "border border-brand-300/60 bg-slate-900/70 text-white hover:border-brand-300"
                    }`}
                >
                  {resetCodeSecondsLeft > 0
                    ? `${authText.resendCodeWait} ${resetCodeCountdownLabel}`
                    : authText.resendCodeButton}
                </button>
                <button
                  type="button"
                  onClick={() => window.open(getMailboxUrl(pendingMailboxEmail), "_blank", "noopener,noreferrer")}
                  className="min-w-0 rounded-lg border border-slate-500/75 bg-slate-900/70 px-4 py-2 text-center text-xs font-semibold leading-snug text-white transition hover:border-brand-300"
                >
                  {authText.mailboxPromptAction}
                </button>
              </div>
            </form>

            {authFeedback.text ? (
              <p className={`mt-4 text-xs ${authFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-500"}`}>
                {authFeedback.text}
              </p>
            ) : null}
          </section>
        </main>
      </div>
    );
  }

  if (isAuthCheckEmailPage) {
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {authHeader}
        <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-12 sm:px-6">
          <section className="auth-glass-card w-full max-w-2xl p-8 text-center md:p-10">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-brand-300/70 bg-brand-500/15 text-brand-200">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
                <path d="M3 6.8A1.8 1.8 0 0 1 4.8 5h14.4A1.8 1.8 0 0 1 21 6.8v10.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 17.2V6.8Zm1.8.2 7.2 4.9L19.2 7H4.8Zm14.4 10.2V8.8l-6.7 4.6a.9.9 0 0 1-1 0L4.8 8.8v8.4h14.4Z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-black text-white md:text-4xl">{authText.mailboxPromptTitle}</h1>
            <p className="mt-3 text-slate-300">
              {pendingMailboxIntent === "recovery" ? authText.resetMailboxSubtitle : authText.mailboxPromptSubtitle}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-200">{pendingMailboxEmail}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.open(getMailboxUrl(pendingMailboxEmail), "_blank", "noopener,noreferrer")}
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-brand-400"
              >
                {authText.mailboxPromptAction}
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (isAuthPage) {
    // Pendant la vérification d'un lien de confirmation (signup_token ou email_change_token dans
    // l'URL), on n'affiche PAS le formulaire de connexion / la boîte « Connecté en tant que… » :
    // juste un loader discret. Le résultat redirige ensuite (compte créé / adresse confirmée /
    // lien invalide + message).
    const authProcessingParams = new URLSearchParams(currentRoute.search || "");
    const isProcessingEmailChange = Boolean(authProcessingParams.get("email_change_token"));
    if (authProcessingParams.get("signup_token") || isProcessingEmailChange) {
      return (
        <div
          className={`auth-page page-enter relative flex min-h-full items-center justify-center overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
          lang={language}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {appToastNode}
          <div
            className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 px-8 py-7"
            style={{ background: "rgba(2,6,23,0.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-400/30 border-t-brand-400" />
            <p className="font-display text-sm font-black" style={{ color: "#fff" }}>
              {isProcessingEmailChange
                ? (language === "en" ? "Confirming your new email…" : language === "ar" ? "جارٍ تأكيد بريدك الجديد…" : "Confirmation de ta nouvelle adresse email…")
                : (language === "en" ? "Confirming your account…" : language === "ar" ? "جارٍ تأكيد حسابك…" : "Confirmation de ton compte en cours…")}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div
        className={`auth-page page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light" : "theme-dark"}`}
        lang={language}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {appToastNode}
        <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <nav className="intro-nav auth-nav flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-[0_12px_36px_rgba(2,8,23,0.5)] backdrop-blur-xl sm:px-6">
            <button type="button" onClick={() => navigateTo("/")} className="flex items-center gap-3 text-left">
              <img src={hmLogo} alt="Logo HM" className="h-11 w-11 rounded-xl border border-brand-300/60" />
              <div>
                <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.1em] text-brand-300 sm:text-[9px]">{content.nav.coachLabel}</p>
                <p className="font-display text-base font-bold tracking-wide text-white sm:text-lg"><BrandAppText /></p>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300"
                  aria-haspopup="menu"
                  aria-expanded={isLangMenuOpen}
                >
                  <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
                  <span>{currentLanguageOption.label}</span>
                </button>

                {isLangMenuOpen ? (
                  <div
                    className={`absolute top-full z-30 mt-2 w-44 rounded-xl border border-slate-600/70 bg-slate-900/95 p-1.5 shadow-[0_12px_24px_rgba(2,8,23,0.45)] backdrop-blur ${isArabic ? "right-0" : "left-0"
                      }`}
                    role="menu"
                  >
                    {Object.entries(languageOptions).map(([code, option]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageChange(code)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${language === code
                            ? "bg-brand-500 text-slate-950"
                            : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
                          }`}
                        role="menuitem"
                      >
                        <span className="text-sm leading-none">{option.flag}</span>
                        <span className="min-w-8">{option.label}</span>
                        <span className={`text-[11px] ${language === code ? "text-slate-900/85" : "text-slate-400"}`}>
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300"
              >
                <span className="text-sm leading-none" aria-hidden="true">
                  {isLight ? "☀️" : "🌙"}
                </span>
                <span>{isLight ? content.controls.lightMode : content.controls.darkMode}</span>
              </button>

              {!currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setRegisterStep(1);
                      setRegisterPersonalValidated(false);
                      setAuthFeedback({ type: "", text: "" });
                      navigateTo(authLoginRoute);
                    }}
                    className={`auth-tab rounded-xl px-3 py-2 text-xs font-semibold transition ${authMode === "login" ? "auth-tab-active" : "auth-tab-idle"
                      }`}
                  >
                    {authText.loginTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setRegisterStep(1);
                      setRegisterPersonalValidated(false);
                      setAuthFeedback({ type: "", text: "" });
                      setSignupPendingEmail("");
                      window.localStorage.removeItem("hm-signup-pending");
                      navigateTo("/auth?mode=register");
                    }}
                    className={`auth-tab rounded-xl px-3 py-2 text-xs font-semibold transition ${authMode === "register" ? "auth-tab-active" : "auth-tab-idle"
                      }`}
                  >
                    {authText.registerTab}
                  </button>
                </>
              ) : null}
            </div>
          </nav>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
          <section className="reveal-up auth-glass-card mx-auto max-w-2xl p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">{authText.title}</p>
            <h1 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">
              {authMode === "register" ? authText.registerTab : authText.loginTab}
            </h1>
            <p className="mt-3 text-slate-200">{authText.subtitle}</p>

            {!currentUser ? (
              <>
                <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
                  {authMode === "register" ? (
                    <div className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2">
                      {[
                        {
                          index: 1,
                          title: signupStepsText.personal || "Informations personnelles",
                          complete: registerPersonalValidated && registerPersonalComplete,
                          active: registerStep === 1
                        },
                        {
                          index: 2,
                          title: signupStepsText.connection || "Informations de connexion",
                          complete: false,
                          active: registerStep === 2
                        }
                      ].map((step) => (
                        <button
                          key={step.index}
                          type="button"
                          onClick={() => {
                            if (step.index === 1) {
                              setRegisterStep(1);
                              setRegisterPersonalValidated(false);
                              setAuthFeedback({ type: "", text: "" });
                              return;
                            }
                            if (!registerPersonalComplete) {
                              setAuthFeedback({ type: "error", text: registerBirthDateError ? authText.ageRestriction : authText.fillAll });
                              return;
                            }
                            setRegisterPersonalValidated(true);
                            setRegisterStep(2);
                            setAuthFeedback({ type: "", text: "" });
                          }}
                          className={
                            "group flex h-full min-h-[78px] items-center gap-2.5 rounded-2xl border p-2.5 text-left transition " +
                            (step.active
                              ? "border-brand-300 bg-brand-500/15 shadow-[0_18px_45px_rgba(16,185,129,0.18)]"
                              : "border-slate-600/55 bg-slate-950/35 hover:border-brand-300/70")
                          }
                        >
                          <span
                            className={
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-black tracking-[0.1em] transition " +
                              (step.complete
                                ? "border-brand-300 bg-brand-500 text-slate-950"
                                : step.active
                                  ? "border-brand-200 bg-brand-500/20 text-brand-100"
                                  : "border-slate-500/70 bg-slate-900/60 text-slate-200")
                            }
                            aria-label={step.complete ? signupStepsText.complete : undefined}
                          >
                            {step.complete ? (
                              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                                <path d="m9.3 16.7-4-4 1.4-1.4 2.6 2.6 8-8 1.4 1.4-9.4 9.4Z" />
                              </svg>
                            ) : (
                              String(step.index).padStart(2, "0")
                            )}
                          </span>
                          <span>
                            <span className="block text-[13px] font-black leading-tight text-white">{step.title}</span>
                            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                              {step.complete ? signupStepsText.complete || "Termine" : step.active ? signupStepsText.active || "En cours" : signupStepsText.step || "Etape"}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {authMode === "register" && registerStep === 1 ? (
                    <div className="space-y-3 rounded-3xl border border-slate-600/45 bg-slate-950/25 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-semibold text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M12 12.5a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2.3c-4 0-7.3 2.1-7.3 4.7V21h14.6v-1.5c0-2.6-3.3-4.7-7.3-4.7Z" />
                            </svg>
                            <span>{authText.firstName}</span>
                          </span>
                          <input
                            type="text"
                            value={authForm.firstName}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, firstName: event.target.value }))}
                            className={authInputClass}
                            placeholder={authText.firstNamePlaceholder}
                            autoComplete="given-name"
                          />
                        </label>

                        <label className="block text-xs font-semibold text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M12 12.5a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2.3c-4 0-7.3 2.1-7.3 4.7V21h14.6v-1.5c0-2.6-3.3-4.7-7.3-4.7Z" />
                            </svg>
                            <span>{authText.lastName}</span>
                          </span>
                          <input
                            type="text"
                            value={authForm.lastName}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, lastName: event.target.value }))}
                            className={authInputClass}
                            placeholder={authText.lastNamePlaceholder}
                            autoComplete="family-name"
                          />
                        </label>

                        <label className="block text-xs font-semibold text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v10h14V10Z" />
                            </svg>
                            <span>{authText.birthDate}</span>
                          </span>
                          <input
                            type="date"
                            value={authForm.birthDate}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, birthDate: event.target.value }))}
                            className={authInputClass}
                            max={todayInputDate}
                            aria-label={authText.birthDatePlaceholder}
                          />
                          {registerBirthDateError ? (
                            <p className="mt-1.5 text-[11px] font-semibold text-red-400">{authText.ageRestriction}</p>
                          ) : null}
                        </label>

                        <label className="block text-xs font-semibold text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0H5Zm13.5-9.5h2v-2h1.5v2h2V13h-2v2h-1.5v-2h-2v-1.5Z" />
                            </svg>
                            <span>{authText.sex}</span>
                          </span>
                          <select
                            value={authForm.sex}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, sex: event.target.value }))}
                            className={authSelectClass}
                          >
                            <option value="">{authText.sexPlaceholder}</option>
                            <option value="male">{authText.sexOptions?.male || "Homme"}</option>
                            <option value="female">{authText.sexOptions?.female || "Femme"}</option>
                          </select>
                        </label>

                        <label className="block text-xs font-semibold text-slate-300 sm:col-span-2">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.9 9h-3.1a15.6 15.6 0 0 0-1.1-5A8.1 8.1 0 0 1 18.9 11ZM12 4.1A13 13 0 0 1 13.8 11h-3.6A13 13 0 0 1 12 4.1ZM4.3 13h3.9a15.6 15.6 0 0 0 1.1 5A8.1 8.1 0 0 1 4.3 13Zm3.9-2H5.1A8.1 8.1 0 0 1 9.3 6a15.6 15.6 0 0 0-1.1 5ZM12 19.9A13 13 0 0 1 10.2 13h3.6A13 13 0 0 1 12 19.9Zm2.7-1.9a15.6 15.6 0 0 0 1.1-5h3.9a8.1 8.1 0 0 1-5 5Z" />
                            </svg>
                            <span>{authText.country}</span>
                          </span>
                          <select
                            value={authForm.country}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, country: event.target.value }))}
                            className={authSelectClass}
                          >
                            <option value="">{authText.countryPlaceholder}</option>
                            {countryOptions.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {(authMode === "login" || (authMode === "register" && registerStep === 2)) ? (
                    <div className="space-y-2.5 rounded-3xl border border-slate-600/45 bg-slate-950/25 p-3.5 sm:p-4">
                      <label className="block text-xs font-semibold text-slate-300">
                        <span className="inline-flex items-center gap-2">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                            <path d="M3 6.8A1.8 1.8 0 0 1 4.8 5h14.4A1.8 1.8 0 0 1 21 6.8v10.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 17.2V6.8Zm1.8.2 7.2 4.9L19.2 7H4.8Zm14.4 10.2V8.8l-6.7 4.6a.9.9 0 0 1-1 0L4.8 8.8v8.4h14.4Z" />
                          </svg>
                          <span>{authText.email}</span>
                        </span>
                        <input
                          type="email"
                          value={authForm.email}
                          onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                          className={authInputClass}
                          placeholder={authText.emailPlaceholder}
                          autoComplete="email"
                        />
                      </label>

                      <div className={authMode === "register" ? "grid gap-2.5 sm:grid-cols-2" : "space-y-2.5"}>
                        <label className="block text-xs font-semibold text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                              <path d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7h14v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z" />
                            </svg>
                            <span>{authText.password}</span>
                          </span>
                          <input
                            type="password"
                            value={authForm.password}
                            onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                            className={authInputClass}
                            placeholder={authText.passwordPlaceholder}
                            autoComplete={authMode === "login" ? "current-password" : "new-password"}
                          />
                        </label>

                        {authMode === "register" ? (
                          <label className="block text-xs font-semibold text-slate-300">
                            <span className="inline-flex items-center gap-2">
                              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-brand-300" aria-hidden="true">
                                <path d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7h14v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z" />
                              </svg>
                              <span>{authText.confirmPassword}</span>
                            </span>
                            <input
                              type="password"
                              value={authForm.confirmPassword}
                              onChange={(event) => setAuthForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                              className={authInputClass}
                              placeholder={authText.confirmPasswordPlaceholder}
                              autoComplete="new-password"
                            />
                          </label>
                        ) : null}
                      </div>

                      {authMode === "register" ? (
                        <PasswordRequirements checks={passwordChecks} labels={authText.passwordRequirements} />
                      ) : null}

                      {authMode === "login" ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-left text-xs font-semibold text-brand-300 transition hover:text-brand-200"
                          >
                            {authText.forgotPassword}
                          </button>
                          {authFeedback.text ? (
                            <p className={`text-xs ${authFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-500"}`}>
                              {authFeedback.text}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {authMode === "register" ? (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {registerStep === 2 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setRegisterStep(1);
                            setRegisterPersonalValidated(false);
                            setAuthFeedback({ type: "", text: "" });
                          }}
                          className="w-full rounded-xl border border-slate-600/70 bg-slate-900/55 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-brand-300 sm:w-1/2"
                        >
                          {signupStepsText.back || "Retour"}
                        </button>
                      ) : null}

                      {registerStep === 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!registerPersonalComplete) {
                              setAuthFeedback({ type: "error", text: registerBirthDateError ? authText.ageRestriction : authText.fillAll });
                              return;
                            }
                            setAuthFeedback({ type: "", text: "" });
                            setRegisterPersonalValidated(true);
                            setRegisterStep(2);
                          }}
                          className="auth-submit w-full rounded-xl px-4 py-2.5 text-sm font-bold transition"
                        >
                          {signupStepsText.next || "Continuer"}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="auth-submit w-full rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-1"
                        >
                          {authText.registerButton}
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="auth-submit w-full rounded-xl px-4 py-2.5 text-sm font-bold transition"
                    >
                      {authText.loginButton}
                    </button>
                  )}
                </form>
              </>
            ) : (
              <div className="mt-5 rounded-lg border border-brand-400/55 bg-brand-500/10 p-4">
                <p className="text-sm font-semibold text-brand-200">
                  {authText.connectedAs}: {currentUser.fullName}
                </p>
                <p className="mt-1 text-xs text-slate-300">{currentUser.email}</p>
                <p className="mt-2 text-xs text-brand-100">{authText.statusReady}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-500/75 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-white transition hover:border-brand-300"
                  >
                    {authText.logoutButton}
                  </button>
                </div>
              </div>
            )}

            {authFeedback.text && authMode !== "login" ? (
              <p className={`mt-3 text-xs ${authFeedback.type === "success" ? "text-brand-300" : "font-semibold text-red-500"}`}>
                {authFeedback.text}
              </p>
            ) : null}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`page-enter relative min-h-full overflow-x-clip ${isLight ? "theme-light bg-slate-50" : "theme-dark bg-slate-950"}`}
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {appToastNode}
      <div
        className={`pointer-events-none absolute inset-x-0 top-[-240px] h-[520px] bg-[radial-gradient(circle_at_15%_45%,rgba(16,185,129,0.22),transparent_42%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,0.20),transparent_40%)] ${isLight ? "opacity-0" : ""
          }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-[520px] h-[620px] bg-[radial-gradient(circle_at_75%_30%,rgba(16,185,129,0.14),transparent_42%),radial-gradient(circle_at_20%_70%,rgba(45,212,191,0.10),transparent_46%)] ${isLight ? "opacity-0" : ""
          }`}
      />

      <header className="sticky top-3 z-50 mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <nav className="intro-nav flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-[0_12px_36px_rgba(2,8,23,0.5)] backdrop-blur-xl sm:px-6 xl:flex-nowrap">
          <div className="flex shrink-0 items-center gap-3">
            <img src={hmLogo} alt="Logo HM" className="h-11 w-11 rounded-xl border border-brand-300/60" />
            <div>
              <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.1em] text-brand-300 sm:text-[9px]">{content.nav.coachLabel}</p>
              <p className="font-display text-base font-bold tracking-wide text-white sm:text-lg"><BrandAppText /></p>
            </div>
          </div>

          <ul className="hidden items-center gap-4 text-sm text-slate-300 lg:flex">
            <li>
              <a
                href="#services"
                onClick={() => setActiveNavSection("services")}
                className={getNavLinkClass("services")}
              >
                <span>{content.nav.services}</span>
                <span className={getNavIndicatorClass("services")} />
              </a>
            </li>
            <li>
              <a
                href="#certifications"
                onClick={() => setActiveNavSection("certifications")}
                className={getNavLinkClass("certifications")}
              >
                <span>{content.nav.certifications}</span>
                <span className={getNavIndicatorClass("certifications")} />
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                onClick={() => setActiveNavSection("experiences")}
                className={getNavLinkClass("experiences")}
              >
                <span>{content.nav.experiences}</span>
                <span className={getNavIndicatorClass("experiences")} />
              </a>
            </li>
            <li>
              <a
                href="#resultats"
                onClick={() => setActiveNavSection("resultats")}
                className={getNavLinkClass("resultats")}
              >
                <span>{content.nav.results}</span>
                <span className={getNavIndicatorClass("resultats")} />
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => setActiveNavSection("contact")}
                className={getNavLinkClass("contact")}
              >
                <span>{content.nav.contact}</span>
                <span className={getNavIndicatorClass("contact")} />
              </a>
            </li>
          </ul>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3 xl:shrink-0">
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300 sm:w-auto"
                aria-haspopup="menu"
                aria-expanded={isLangMenuOpen}
              >
                <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
                <span>{currentLanguageOption.label}</span>
              </button>

              {isLangMenuOpen ? (
                <div
                  className={`absolute top-full z-30 mt-2 w-44 rounded-xl border border-slate-600/70 bg-slate-900/95 p-1.5 shadow-[0_12px_24px_rgba(2,8,23,0.45)] backdrop-blur ${isArabic ? "right-0" : "left-0"
                    }`}
                  role="menu"
                >
                  {Object.entries(languageOptions).map(([code, option]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleLanguageChange(code)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${language === code
                          ? "bg-brand-500 text-slate-950"
                          : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
                        }`}
                      role="menuitem"
                    >
                      <span className="text-sm leading-none">{option.flag}</span>
                      <span className="min-w-8">{option.label}</span>
                      <span className={`text-[11px] ${language === code ? "text-slate-900/85" : "text-slate-400"}`}>
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300 sm:w-auto"
            >
              <span className="text-sm leading-none" aria-hidden="true">
                {isLight ? "☀️" : "🌙"}
              </span>
              <span>{isLight ? content.controls.lightMode : content.controls.darkMode}</span>
            </button>

            {currentUser && isCoachAccount ? null : currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setActiveNavKey("dashboard");
                  navigateTo(
                    currentUser.sportProfileCompleted
                      ? "/dashboard"
                      : "/complete-profile"
                  );
                }}
                className="w-full whitespace-nowrap rounded-lg border border-brand-300/70 bg-brand-500/15 px-3 py-2 text-xs font-semibold text-brand-200 transition hover:border-brand-300 hover:bg-brand-500/20 sm:w-auto"
              >
                {authText.accessAthleteSpace}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigateToAuth("login")}
                  className="w-full whitespace-nowrap rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-300 sm:w-auto"
                >
                  {authText.loginTab}
                </button>

                <button
                  type="button"
                  onClick={() => navigateToAuth("register")}
                  className="w-full whitespace-nowrap rounded-lg border border-brand-300/70 bg-brand-500/15 px-3 py-2 text-xs font-semibold text-brand-200 transition hover:border-brand-300 hover:bg-brand-500/20 sm:w-auto"
                >
                  {authText.registerTab}
                </button>
              </>
            )}

          </div>
        </nav>
      </header>

      <main key={`content-${language}-${theme}`} className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section id="hero" className="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:py-20">
          <div className="intro-left">
            <p className="inline-flex rounded-full border border-brand-400/35 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-100">
              {content.hero.chip}
            </p>
            <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              {content.hero.line1}
              <span className="block text-brand-400">{content.hero.line2}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{content.hero.description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-xl bg-brand-500 px-7 py-3 text-base font-bold text-slate-950 shadow-[0_16px_32px_rgba(16,185,129,0.35)] transition hover:bg-brand-400"
              >
                {content.hero.primaryCta}
              </a>
              <a
                href="#resultats"
                className="rounded-xl border border-slate-600 bg-slate-900/70 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-brand-400"
              >
                {content.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="intro-right relative isolate lg:h-full">
            <div className="hero-float pointer-events-none absolute -left-8 top-10 h-36 w-36 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="hero-float pointer-events-none absolute -bottom-8 -right-4 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

            <div
              className="overflow-hidden rounded-[1.45rem] border border-brand-300/45 bg-slate-900/75 shadow-[0_35px_90px_rgba(15,118,110,0.35)] backdrop-blur-xl"
              style={{
                backgroundImage: `url(${coachHero})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="relative h-[340px] w-full sm:h-[410px] lg:h-[470px]">
                {heroImages.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt="Hicham coach sportif"
                    loading="eager"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackApplied) {
                        e.currentTarget.dataset.fallbackApplied = "1";
                        e.currentTarget.src = coachHero;
                      }
                    }}
                    className={`hero-slide absolute inset-0 h-full w-full rounded-[1.45rem] object-cover object-center ${activeHeroIndex === index ? "hero-slide--active" : "hero-slide--inactive"
                      }`}
                  />
                ))}
                <div key={`glint-${activeHeroIndex}`} className="hero-glint" />
              </div>
            </div>
          </div>
        </section>

        <section className="reveal-up pb-10" style={{ "--d": "520ms" }}>
          <div className="grid gap-4 md:grid-cols-3">
            {content.stats.map((item, index) => {
              const isRatingStat = index === 2;
              const isClientsStat = index === 1;
              const clientsValue = athleteCount === null ? "…" : String(athleteCount);
              return (
                <article key={`stat-${index}`} className="reveal-up rounded-3xl border border-white/80 bg-slate-900/65 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-2xl font-black tracking-tight text-slate-100">
                      {isRatingStat
                        ? averageClientRatingLabel
                        : isClientsStat
                          ? clientsValue
                          : item.value}
                    </p>
                    {isRatingStat ? (
                      <p
                        data-testid="rating-review-count"
                        className="text-xs font-black uppercase tracking-[0.08em] text-brand-200 whitespace-nowrap"
                      >
                        {clientReviewCount} {clientReviewCount > 1 ? "avis" : "avis"}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-1 space-y-0">
                    {item.labelLines.map((line) => (
                      <p key={line} className="text-sm uppercase tracking-[0.08em] text-slate-300 md:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="services" className="reveal-up py-16" style={{ "--d": "620ms" }}>
          <SectionTitle
            chip={content.servicesSection.chip}
            title={content.servicesSection.title}
            subtitle={content.servicesSection.subtitle}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.services.map((service, index) => (
              <article
                key={`service-${index}`}
                className="reveal-up rounded-[2rem] border border-brand-400/60 bg-slate-900/70 p-7 shadow-[0_14px_30px_rgba(2,8,23,0.38)] transition hover:border-brand-300"
              >
                <p className="inline-flex rounded-full border border-brand-400/70 bg-brand-500/15 px-3 py-1 text-sm font-black tracking-[0.16em] text-brand-300">
                  {service.icon}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="reveal-up py-16" style={{ "--d": "860ms" }}>
          <SectionTitle
            chip={content.certificationsSection.chip}
            title={content.certificationsSection.title}
            subtitle={content.certificationsSection.subtitle}
          />

          <div className="mt-8 space-y-6">
            {content.certifications.map((cert, index) => {
              const certImages = cert.sliderImages ?? (cert.image ? [cert.image] : []);
              const hasImage = certImages.length > 0;
              const isSlider = certImages.length > 1;
              const imageOnRight = cert.imagePosition === "right";
              const currentImageIndex = isSlider ? activeIfbbSlide : 0;

              return (
                <article
                  key={`cert-${index}`}
                  className="reveal-up group relative overflow-hidden rounded-[2rem] border border-slate-500/55 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] p-6 shadow-[0_18px_42px_rgba(2,8,23,0.45)] md:p-8"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

                  <div className={`relative z-10 grid gap-8 ${hasImage ? "lg:grid-cols-2 lg:items-center" : ""}`}>
                    {hasImage && !imageOnRight ? (
                      <CertificationMedia
                        certTitle={cert.title}
                        certImages={certImages}
                        isSlider={isSlider}
                        currentImageIndex={currentImageIndex}
                        dotKeyPrefix="ifbb-dot-left"
                      />
                    ) : null}

                    <div>
                      <h3 className="font-display text-3xl font-bold leading-tight text-white">{cert.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-brand-300/55 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-brand-200">
                          {cert.organization}
                        </span>
                        <span className="rounded-full border border-slate-400/45 bg-slate-800/40 px-3 py-1 text-xs uppercase tracking-[0.11em] text-slate-200">
                          {cert.dateLocation}
                        </span>
                        {cert.serial ? (
                          <span className="rounded-full border border-slate-400/45 bg-slate-800/40 px-3 py-1 text-xs uppercase tracking-[0.11em] text-slate-200">
                            {content.contact.labels.serial}: {cert.serial}
                          </span>
                        ) : null}
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-slate-300">
                        {cert.details.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {hasImage && imageOnRight ? (
                      <CertificationMedia
                        certTitle={cert.title}
                        certImages={certImages}
                        isSlider={isSlider}
                        currentImageIndex={currentImageIndex}
                        dotKeyPrefix="ifbb-dot-right"
                      />
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="experiences" className="reveal-up py-16" style={{ "--d": "1040ms" }}>
          <SectionTitle
            chip={content.experiencesSection.chip}
            title={content.experiencesSection.title}
            subtitle={content.experiencesSection.subtitle}
          />

          <div className="relative mt-8 space-y-6 md:pl-10">
            <div className="absolute bottom-2 left-3 top-2 hidden w-px bg-gradient-to-b from-brand-300/85 via-brand-400/50 to-transparent md:block" />
            {content.experiences.map((experience, index) => (
              <article
                key={`experience-${index}`}
                className="reveal-up group relative overflow-hidden rounded-[1.8rem] border border-slate-500/55 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] p-6 shadow-[0_16px_36px_rgba(2,8,23,0.45)] transition hover:border-brand-300/65 md:p-7"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-500/10 blur-3xl" />
                <span className="absolute -left-[1.05rem] top-12 hidden h-4 w-4 rounded-full border-2 border-slate-900 bg-brand-300 shadow-[0_0_16px_rgba(52,211,153,0.8)] md:block" />
                <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-3xl font-bold leading-tight text-white">{experience.role}</h3>
                    <p className="mt-2 inline-flex rounded-full border border-brand-300/55 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-brand-200">
                      {experience.company}
                    </p>
                  </div>
                  <p className="text-sm text-slate-200 md:rounded-full md:border md:border-slate-400/45 md:bg-slate-800/40 md:px-3 md:py-1 md:text-xs md:uppercase md:tracking-[0.11em]">
                    {experience.dateLocation}
                  </p>
                </div>
                <ul className="relative z-10 mt-5 space-y-2 text-sm text-slate-300 md:text-base">
                  {experience.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 rounded-full bg-brand-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="apropos" className="reveal-up py-16" style={{ "--d": "1160ms" }}>
          <div className="reveal-up rounded-3xl border border-slate-700 bg-slate-900/70 p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <SectionTitle
                chip={content.aboutSection.chip}
                title={content.aboutSection.title}
                subtitle={content.aboutSection.subtitle}
              />
            </div>

            <div className="reveal-up mt-7 rounded-2xl border border-brand-300/35 bg-slate-950/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                {content.aboutSection.missionTitle}
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-200">{content.aboutSection.missionText}</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="reveal-up rounded-2xl border border-slate-600/70 bg-slate-950/45 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  {content.aboutSection.approachTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{content.aboutSection.approachText}</p>
              </article>

              <article className="reveal-up rounded-2xl border border-slate-600/70 bg-slate-950/45 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  {content.aboutSection.objectiveTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{content.aboutSection.objectiveText}</p>
              </article>
            </div>
          </div>
        </section>

        <section id="resultats" className="reveal-up py-16" style={{ "--d": "1240ms" }}>
          <SectionTitle
            chip={content.resultsSection.chip}
            title={content.resultsSection.title}
            subtitle={content.resultsSection.subtitle}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.results.map((result, index) => (
              <article key={`result-${index}`} className="reveal-up overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
                <img src={result.image} alt={`Resultat client ${result.name}`} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <p className="font-display text-2xl font-black text-brand-400">{result.detail}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {content.resultsSection.witnessPrefix} {result.name}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {clientReviews.length ? (
            <div className="mt-10">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-300">
                  {language === "en" ? "Athlete testimonials" : language === "ar" ? "شهادات الرياضيين" : "Témoignages athlètes"}
                </p>
                <h3 className="mt-2 font-display text-2xl font-black text-white md:text-3xl">
                  {language === "en" ? "What our athletes say" : language === "ar" ? "ماذا يقول رياضيونا" : "Ce que disent nos athlètes"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {language === "en"
                    ? "Discover our members' feedback on their progress with Coach Hicham."
                    : language === "ar"
                      ? "اكتشف آراء أعضائنا حول تقدمهم مع الكوتش هشام."
                      : "Découvrez les retours de nos membres sur leur progression avec Coach Hicham."}
                </p>
              </div>

              {sortedClientReviews.length > 0 ? (
              <div className="hf-reviews-marquee mt-6" aria-label={content.contact.reviewsTitle}>
                <div className="hf-reviews-marquee__track">
                {(sortedClientReviews.length >= 4
                  ? [...sortedClientReviews, ...sortedClientReviews]
                  : (() => {
                      const base = Array.from({ length: Math.ceil(6 / sortedClientReviews.length) }).flatMap(() => sortedClientReviews);
                      return [...base, ...base];
                    })()
                ).map((review, dupIndex) => {
                  const isOwnReview = Boolean(currentUser?.id && review.authorId === currentUser.id);
                  const isHighlightedReview = highlightedReviewId === review.id;
                  const reviewAvatarUrl = isOwnReview
                    ? currentUser.avatarUrl || sportProfile.avatar_url || review.avatarUrl
                    : review.avatarUrl;

                  return (
                    <article
                      key={`${review.id}-${dupIndex}`}
                      className={`hf-review-card group relative flex h-[200px] flex-col overflow-hidden rounded-2xl p-4 ${isHighlightedReview || isOwnReview
                          ? "border-2 border-emerald-400"
                          : "border border-emerald-100"
                        }`}
                    >
                      <div className="flex min-h-0 flex-1 items-start gap-3">
                        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-300/55 bg-brand-500 text-sm font-black text-slate-950 shadow-[0_12px_30px_-18px_rgba(34,197,94,0.9)]">
                          {reviewAvatarUrl ? (
                            <img src={reviewAvatarUrl} alt={review.authorName} className="h-full w-full object-cover" />
                          ) : (
                            <span>
                              {getInitials(review.authorName)}
                            </span>
                          )}
                        </div>
                        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-white">{review.authorName}</p>
                              <p className="text-xs font-semibold text-slate-400">{formatDisplayDate(review.createdAt, displayLocale)}</p>
                            </div>
                            <div className="shrink-0 text-sm leading-none" aria-label={`${review.rating}/5`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={review.rating >= star ? "text-amber-300" : "text-slate-600"}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="hf-review-card__message mt-3 text-sm leading-relaxed text-slate-200">
                            {review.message}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
                </div>
              </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section id="contact" className="reveal-up py-16" style={{ "--d": "1400ms" }}>
          <div className="rounded-3xl border border-brand-400/35 bg-gradient-to-r from-brand-500/15 via-slate-900/70 to-cyan-500/10 p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">{content.contact.chip}</p>
            <h2 className="mt-3 font-display text-4xl font-black text-white md:text-5xl">{content.contact.title}</h2>
            <p className="mt-4 max-w-2xl text-slate-200">{content.contact.subtitle}</p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <form onSubmit={handleContactSubmit} className="reveal-up rounded-2xl border border-slate-600/70 bg-slate-900/65 p-5">
                <div className="rounded-2xl border border-brand-400/30 bg-brand-500/10 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-300">
                    {currentUser ? content.contact.reviewAccountLabel : content.contact.reviewAccountRequired}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">
                    {currentUser ? getUserDisplayName(currentUser) : content.contact.loginRequired}
                  </p>
                  <p className="mt-2 rounded-xl border border-brand-300/25 bg-slate-950/35 px-3 py-2 text-xs font-bold leading-relaxed text-brand-100">
                    {content.contact.singleReviewNote}
                  </p>
                </div>

                <label className="mt-4 block text-sm text-slate-200">
                  <span className="flex items-center justify-between gap-3">
                    <span>{content.contact.fields.message}</span>
                    <span className="text-xs font-black text-slate-400">
                      entre {reviewMinCharacters} et {reviewMaxCharacters} caractères
                    </span>
                  </span>
                  <span className="relative mt-2 block">
                    <textarea
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value.slice(0, reviewMaxCharacters)
                        }))
                      }
                      maxLength={reviewMaxCharacters}
                      rows={5}
                      className="w-full resize-none rounded-lg border border-slate-500/70 bg-slate-950/70 px-3 pb-7 pt-2 text-sm text-white outline-none transition focus:border-brand-300"
                      placeholder={content.contact.fields.messagePlaceholder}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-3 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[11px] font-black text-slate-400">
                      {reviewCharacterCount}/{reviewMaxCharacters}
                    </span>
                  </span>
                </label>

                <div className="mt-4">
                  <p className="text-sm text-slate-200">{content.contact.ratingLabel}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setContactForm((prev) => ({ ...prev, rating: star }))}
                        className="text-2xl leading-none transition hover:scale-110"
                        aria-label={`${content.contact.ratingAction} ${star}/5`}
                      >
                        <span className={contactForm.rating >= star ? "text-amber-300" : "text-slate-500"}>★</span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-200">
                      {contactForm.rating ? `${contactForm.rating}/5` : "0/5"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!reviewCanSubmit}
                    className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500 disabled:text-white disabled:opacity-45 disabled:hover:bg-brand-500"
                  >
                    {editingReviewId ? content.contact.submitEdit : content.contact.submit}
                  </button>
                  {currentUserReview ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(currentUserReview.id)}
                      disabled={isReviewSaving}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/60 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
                      </svg>
                      {content.contact.reviewDelete}
                    </button>
                  ) : null}
                </div>

                {sendFeedback.text ? (
                  <p className={`mt-3 rounded-2xl border px-3 py-2 text-xs font-bold ${sendFeedback.type === "success"
                      ? "border-brand-300/35 bg-brand-500/10 text-brand-200"
                      : "border-red-300/40 bg-red-500/10 text-red-300"
                    }`}>
                    {sendFeedback.text}
                  </p>
                ) : null}
              </form>

              <div className="reveal-up rounded-2xl border border-slate-600/70 bg-slate-900/65 p-5">
                <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-400/60 bg-brand-500/10 text-brand-300">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.9 3.4L12 11 5.1 7.6 12 4.2Zm-7 5.1 6 3v7.1l-6-3V9.3Zm8 10.1v-7.1l6-3v7.1l-6 3Z" />
                    </svg>
                  </span>
                  <span>{content.contact.socialTitle}</span>
                </h3>
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  {siteContacts.map((contact, index) => {
                    const external = !["email", "phone"].includes(contact.kind);
                    return (
                      <a
                        key={`${contact.kind}-${index}`}
                        href={contactHref(contact)}
                        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-xl border border-slate-600/70 bg-slate-950/55 px-3 py-2.5 transition hover:border-brand-300"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-400/60 bg-brand-500/10 text-brand-300">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d={contactIconPath(contact.kind)} />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-300">{contact.label || contact.kind}</p>
                          <p className="truncate font-semibold text-brand-300 group-hover:text-brand-200">{contactDisplay(contact)}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <a
                  href="#hero"
                  className="mt-6 inline-block rounded-xl border border-slate-500/70 bg-slate-900/65 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-brand-300"
                >
                  {content.contact.backTop}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6 sm:text-sm">
          <p>{content.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
