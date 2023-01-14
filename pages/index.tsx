import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { buttonDatas, stats } from '../lib/data';
import { RequestHelper } from '../lib/request-helper';
import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/storage';
import KeynoteSpeaker from '../components/KeynoteSpeaker';
import HomeChallengeCard from '../components/HomeChallengeCard';
import MemberCards from '../components/MemberCards';
import SponsorCard from '../components/SponsorCard';
import FAQ from '../components/faq';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import testLogo from '../public/assets/hp-logo.png';
import Image from 'next/image';

/**
 * The home page.
 *
 * Landing: /
 *
 */
export default function Home(props: {
  keynoteSpeakers: KeynoteSpeaker[];
  challenges: Challenge[];
  answeredQuestion: AnsweredQuestion[];
  fetchedMembers: TeamMember[];
  sponsorCard: Sponsor[];
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [speakers, setSpeakers] = useState<KeynoteSpeaker[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sponsor, setSponsor] = useState<Sponsor[]>([]);
  const [challengeData, setChallengeData] = useState({
    title: '',
    organization: '',
    description: '',
    prizes: [],
  });

  const [notif, setNotif] = useState(false);

  const colorSchemes: ColorScheme[] = [
    {
      light: '#4eada2',
      dark: '#656fbd',
    },
    {
      light: '#20d5c3',
      dark: '#074350',
    },
    {
      dark: '#530a59',
      light: '#FDECFF',
    },
  ];

  useEffect(() => {
    // Set amount of time notification prompt gets displayed before fading out
    setNotif(checkNotif());
    setTimeout(fadeOutEffect, 3000);
    setSpeakers(props.keynoteSpeakers);

    //Organize challenges in order by rank given in firebase
    const sortedChallenges = props.challenges.sort((a, b) => (a.rank > b.rank ? 1 : -1));

    if (sortedChallenges.length != 0) {
      setChallenges(sortedChallenges);
      setChallengeData({
        title: sortedChallenges[0].title,
        organization: sortedChallenges[0].organization,
        description: sortedChallenges[0].description,
        prizes: sortedChallenges[0].prizes,
      });
    }
    setSponsor(props.sponsorCard);

    //Organize members in order by rank given in firebase
    setMembers(props.fetchedMembers.sort((a, b) => (a.rank > b.rank ? 1 : -1)));
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initialize styles to first organization in list
    if (document.getElementById(`org${challengeIdx}`) !== null) {
      document.getElementById(`org${challengeIdx}`).style.textDecoration = 'underline';
      (
          document.getElementById(`org${challengeIdx}`).firstElementChild as HTMLElement
      ).style.display = 'block';
    }
  });

  // Fade out notification prompt
  const fadeOutEffect = () => {
    var fadeTarget = document.getElementById('popup');

    if (fadeTarget !== undefined && fadeTarget !== null) {
      var fadeEffect = setInterval(() => {
        if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = '1';
        }
        if (parseFloat(fadeTarget.style.opacity) > 0) {
          fadeTarget.style.opacity = (parseFloat(fadeTarget.style.opacity) - 0.1).toString();
        } else {
          clearInterval(fadeEffect);
        }
      }, 100);
    }
  };

  const checkNotif = () => {
    //pop up visible if user did not enable push notif and browser supports push notif
    const isSupported =
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        firebase.messaging.isSupported();
    if (isSupported && Notification.permission !== 'granted') {
      Notification.requestPermission();
      return true;
    }
    return false;
  };

  const changeOrg = (challenge, newIdx) => {
    document.getElementById(`org${challengeIdx}`).style.textDecoration = 'none';
    (document.getElementById(`org${challengeIdx}`).firstElementChild as HTMLElement).style.display =
        'none';
    document.getElementById(`org${newIdx}`).style.textDecoration = 'underline';
    (document.getElementById(`org${newIdx}`).firstElementChild as HTMLElement).style.display =
        'block';

    setChallengeIdx(newIdx);
    setChallengeData({
      title: challenge.title,
      organization: challenge.organization,
      description: challenge.description,
      prizes: challenge.prizes,
    });
  };

  if (loading) {
    return (
        <div>
          <h1>Loading...</h1>
        </div>
    );
  }

  const styles = {
    background:
        'linear-gradient(180deg, var(--color1), var(--color2) , var(--color3), var(--color4), var(--color5), var(--color6))',
    '--color1': '#B05E40',
    '--color2': '#EBC793',
    '--color3': '#F7F6C6',
    '--color4': '#64A4CC',
    '--color5': '#375FBD',
    '--color6': '#1C0D69',
  };

  const heroStyle = {
    //Create a black border around the box
    border: '4px solid black',
    //Set background of the box to a gradient rainbow
    background:
        'linear-gradient(180deg, var(--color2) , var(--color3), var(--color3), var(--color2) )',
    '--color1': '#B05E40',
    '--color2': '#EBC793',
    '--color3': '#F7F6C6',
    minHeight: 480,
    //give the box a shadow
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
    //Font settings
    fontFamily: 'Arial',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    //Set the text to be centered
    textAlign: 'center',
    //Set the text to be vertically centered
    display: 'flex',
  };

  const heroSubStyle = {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
    display: 'flex',
    fontFamily: 'Arial',
  };

  const buttonStyle = {
    //Make the buttons look like bubbles
    borderRadius: '50%',
    //Give the buttons a shadow
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
    //Set the background of the buttons to a gradient
    background: 'linear-gradient(180deg, var(--color1), var(--color2) )',
    '--color1': '#64A4CC',
    '--color2': '#375FBD',
    //Set the border of the buttons to a gradient
    border: '4px solid var(--color3) ',
    '--color3': '#EBC793',
    //Set the font color of the buttons to white
    color: 'white',
    //Change font to times new roman
    fontFamily: 'Arial',
    //Set the font size of the buttons to 18px
    fontSize: '24px',
    //Set the font weight of the buttons to bold
    fontWeight: 'bold',
    //Set the width and height of the buttons to 100px
    width: '200px',
    height: '200px',
  };

  const backgroundStyle = {
    backgroundImage: testLogo,
  };

  const sparkleKeyframes = {
    '0%': {
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
    },
    '50%': {
      boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.5)',
    },
    '100%': {
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
    },
  };

  const sparkleAnimation = {
    '@keyframes sparkle': sparkleKeyframes,
  };

  // @ts-ignore
  // @ts-ignore
  return (
      <section style={styles}>
        <>
          <Head>
            <title>sunhacks hackathon 2022</title> {/* !change */}
            <meta name="description" content="A default HackPortal instance" /> {/* !change */}
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {/* Notification info pop up */}
          {notif && (
              <div
                  id="popup"
                  className="fixed z-50 md:translate-x-0 translate-x-1/2 w-[22rem] rounded-md px-4 py-2 top-16 md:right-6 right-1/2 bg-red-200 md:text-base text-sm"
              >
                Turn on push notifications to recieve announcements!
              </div>
          )}
          {/* Hero section */}
          <section className="min-h-screen p-20 ">
            <div  className="max-w-50xl mx-auto flex flex-col justify-center items-center rounded-lg" style={heroStyle}>
              <div>
                <h1 className="text-center md:text-9xl text-black-400">sunhacks</h1>{' '}
                {/* !change */}
                <p style={heroSubStyle}>
                  {' '}
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Arizona State University's premier hackathon
                  {/* !change */}
                </p>
              </div>
              {/* TODO: Programmatically show these based on configured times/organizer preference */}
            </div>
            <div className="flex items-baseline md:flex-row-reverse md:justify-around md:space-y-20 ">
              {buttonDatas.map((button) => (
                  <button
                      key={button.text}
                      onClick={() => router.push(button.path)}
                      className="max-w-[9rem] w-[9rem] md:max-w-full py-10"
                      style={buttonStyle}
                  >
                    {button.text}
                  </button>
              ))}
            </div>
          </section>
          {/* Video Space */}
          <section className="z-0 relative md:h-[560px] py-[3rem] pl-10">
            <div className="flex flex-col justify-center items-center md:flex-row">
              {/* Video */}
              {/* !change */}
              <iframe
                  className="video"
                  width="700"
                  height="400"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              ></iframe>
              {/* Stats */}
              <div className="">
                {stats.map((stat, index) => (
                    <div
                        key={stat.data}
                        className={`${
                            index % 2 === 0 ? 'lg:ml-40 md:ml-20 ml-14' : 'md:mr-8 mr-24'
                        } text-center md:my-6 my-4`}
                    >
                      <p className="font-bold text-2xl text-indigo-600 lg:text-5xl">{stat.data}</p>
                      <p className="font-medium text-lg lg:text-3xl">{stat.object}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>
          {/* About section */}
          <section className="md:p-12 p-6">
            <h1 className="md:text-4xl text-2xl font-bold my-4">About HackPortal</h1> {/* !change */}
            <div className="md:text-base text-sm">
              HackPortal is a platform for user-friendly hackathon event management. <br />
              <br />A few of its features include: A fully customizable front end, sign in with email/
              Google, hacker registration, images, challenges, sponsors, FAQ and more fetched from
              backend, push notifications, a spotlight carousel highlighting ongoing events, QR code
              check in and swag claims, report submission/ Ask a question, a built-in and easy to set
              up schedule, Hacker, Admin, and Super Admin roles, an Admin console to send
              announcements, update user roles, show number of check-ins, swag claims, and more!.{' '}
              <br />
              <br />
              To set up HackPortal for your hackathon, check out the{' '}
              <a
                  href="https://github.com/acmutd/hackportal/blob/develop/docs/set-up.md"
                  className="underline"
              >
                HackPortal Github
              </a>
              !
            </div>
          </section>
          {/* Featuring Keynotes speakers */}

          {speakers.length != 0 && (
              <section className="flex overflow-x-auto min-h-[24rem] md:p-6">
                <div className="flex items-center justify-center font-bold p-6 md:text-4xl text-2xl my-4">
                  Featuring Keynote Speakers
                </div>
                <div className="flex flex-col justify-center py-6 md:px-6">
                  {/* Row 1 */}
                  <div className="flex">
                    {speakers.map(
                        ({ name, description, fileName }, idx) =>
                            idx < speakers.length / 2 && (
                                <KeynoteSpeaker
                                    key={idx}
                                    name={name}
                                    description={description}
                                    cardColor={colorSchemes[idx % 3]}
                                    imageLink={fileName}
                                />
                            ),
                    )}
                  </div>
                  {/* row 2 */}
                  <div className="flex md:ml-[7rem] ml-[5rem]">
                    {speakers.map(
                        ({ name, description, fileName }, idx) =>
                            idx >= speakers.length / 2 && (
                                <KeynoteSpeaker
                                    key={idx}
                                    name={name}
                                    description={description}
                                    cardColor={colorSchemes[idx % 3]}
                                    imageLink={fileName}
                                />
                            ),
                    )}
                  </div>
                </div>
              </section>
          )}
          {/* Challenges */}
          {/* This section is hidden if there are no challenges */}
          {challenges.length != 0 && (
              <section className="p-6 ">
                <div className="font-bold p-6 md:text-4xl text-2xl my-4">Challenges</div>
                <div className="flex">
                  {/* Challenge Orgs Selectors*/}
                  <div className="md:w-1/4 w-1/5">
                    {challenges.map((challenge, idx) => (
                        <div
                            id={`org${idx}`}
                            className={`${idx} relative cursor-pointer text-center md:text-lg sm:text-sm text-xs md:py-6 py-4 my-4 bg-purple-200 rounded-sm`}
                            key={idx}
                            onClick={() => changeOrg(challenge, idx)}
                        >
                          {/* change arrow color in global css to match parent selector */}
                          <div className="arrow-right absolute top-1/2 right-0 -translate-y-1/2 translate-x-full hidden"></div>
                          {challenge.organization}
                        </div>
                    ))}
                  </div>
                  {/* Challenges Description Cards */}

                  <div className="md:w-3/4 w-4/5 my-4 pl-6 min-h-full">
                    {/* Card */}
                    <HomeChallengeCard
                        title={challengeData.title}
                        organization={challengeData.organization}
                        description={challengeData.description}
                        prizes={challengeData.prizes}
                    />
                  </div>
                </div>
              </section>
          )}
          {/* FAQ */}
          {props.answeredQuestion.length != 0 && (
              <section>
                <FAQ fetchedFaqs={props.answeredQuestion}></FAQ>
              </section>
          )}
          {members.length != 0 && (
              <section>
                {/* Team Members */}
                <div className="flex flex-col flex-grow md:p-6">
                  <div className="my-2">
                    <h4 className="font-bold p-6 md:text-4xl text-2xl my-4">Meet Our Team :)</h4>{' '}
                    {/* !change */}
                    <div className="flex flex-wrap justify-center md:px-2">
                      {/* Member Cards */}
                      {members.map(
                          ({ name, description, linkedin, github, personalSite, fileName }, idx) => (
                              <MemberCards
                                  key={idx}
                                  name={name}
                                  description={description}
                                  fileName={fileName}
                                  linkedin={linkedin}
                                  github={github}
                                  personalSite={personalSite}
                              />
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </section>
          )}
          {/* Sponsors */}
          {sponsor.length != 0 && (
              <section>
                <div className="flex flex-col flex-grow md:p-6">
                  <h4 className="font-bold p-6 md:text-4xl text-2xl my-4">Sponsors</h4>
                  {/* Sponsor Card */}
                  <section className="flex flex-wrap justify-center p-4">
                    {sponsor.map(({ link, reference }, idx) => (
                        <SponsorCard key={idx} link={link} reference={reference} />
                    ))}
                  </section>
                  <h2 className="my-2 text-center">
                    {' '}
                    {/* !change */}
                    If you would like to sponsor sunhacks, please reach out to us at&nbsp;
                    <a
                        href="mailto:sunhacks@email.com"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="underline"
                    >
                      sunhacks@email.com
                    </a>
                  </h2>
                </div>
              </section>
          )}

          {/* Footer */}
          <section className=" mt-16 px-6 py-8 md:text-base text-xs">
            {/* Upper Content */}
            <div className="my-2 relative">
              {/* Social icons */} {/* !change */}
              <div className="space-x-4 > * + *">
                <a href="https://twitter.com/hackutd" rel="noopener noreferrer" target="_blank">
                  <TwitterIcon className="footerIcon" />
                </a>
                <a
                    href="https://www.instagram.com/hackutd/?hl=en"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                  <InstagramIcon className="footerIcon" />
                </a>
                <a href="https://www.facebook.com/hackutd/" rel="noopener noreferrer" target="_blank">
                  <FacebookIcon className="footerIcon" />
                </a>
              </div>
              {/* Text */}
              <div className="absolute bottom-0 right-0">
                {' '}
                {/* !change */}
                Checkout HackUTD&apos;s{' '}
                <a
                    href="https://acmutd.co/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-black hover:underline"
                >
                  organizer site
                </a>
              </div>
            </div>
            {/* Lower Content */}
            <div className="flex justify-between border-t-[1px] py-2 border-black">
              <div>
                Designed by <p className="font-black inline">HackUTD</p> <br /> {/* !change */}
                {/* PLEASE DO NOT CHANGE <3 */}
                HackPortal developed with &lt;3 by <p className="font-black inline">
                HackUTD
              </p> and <p className="font-black inline">ACM Development</p>
                {/* PLEASE DO NOT CHANGE <3 */}
              </div>

              <div className="flex md:flex-row flex-col md:ml-0 ml-6">
                {/* !change */}
                <a
                    href="mailto:email@organization.com"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="hover:underline md:mr-8 font-thin"
                >
                  Contact Us
                </a>
                {/* !change */}
                <a
                    href="https://github.com/acmutd/hackportal"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-thin whitespace-nowrap"
                >
                  Source Code
                </a>
              </div>
            </div>
          </section>
        </>
      </section>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: keynoteData } = await RequestHelper.get<KeynoteSpeaker[]>(
      `${protocol}://${context.req.headers.host}/api/keynotespeakers`,
      {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
      `${protocol}://${context.req.headers.host}/api/challenges/`,
      {},
  );
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
      `${protocol}://${context.req.headers.host}/api/questions/faq`,
      {},
  );
  const { data: memberData } = await RequestHelper.get<TeamMember[]>(
      `${protocol}://${context.req.headers.host}/api/members`,
      {},
  );
  const { data: sponsorData } = await RequestHelper.get<Sponsor[]>(
      `${protocol}://${context.req.headers.host}/api/sponsor`,
      {},
  );
  return {
    props: {
      keynoteSpeakers: keynoteData,
      challenges: challengeData,
      answeredQuestion: answeredQuestion,
      fetchedMembers: memberData,
      sponsorCard: sponsorData,
    },
  };
};