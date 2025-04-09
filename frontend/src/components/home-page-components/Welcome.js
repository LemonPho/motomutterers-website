import React from "react";
import { Link } from "react-router-dom";
import { useApplicationContext } from "../ApplicationContext";

export default function Welcome() {
    const { currentSeason, currentSeasonLoading } = useApplicationContext();

    if(currentSeasonLoading) return;

    return(
        <div className="card rounded-15 element-background-color element-border-color p-2">
            <div className="card-header rounded-15 nested-element-color mb-3">
                <h3>Welcome to the Motomutterers Fantasy League</h3>
            </div>
            <div className="card-body nested-element-color rounded-15">
                <h4>Basic Idea</h4>
                <hr />
                <span>The <strong>MotoMutterers Fantasy League</strong> is based on the <strong>MotoGP World Championship</strong>. Anyone can join by submitting their season-long predictions, and at the end of the year, the person whose picks most closely match the actual final standings wins.</span>
                <h4>Picks</h4>
                <hr />
                <span>There is a window that is opened when the season finishes until the first race weekend of the next season to select picks, during that time there is no limit to how many times one desires to change their picks.</span>
                <ul>
                    <li><strong>Top 5:</strong> Each member selects five riders they believe will finish in the top 5 overall at the end of the MotoGP season, including the exact order of their positions.</li>
                    <li><strong>Independent and Rookie Picks:</strong> Members also pick one independent rider and one rookie who they think will finish highest in their respective categories. This sometimes is not included or there is only an independent or rookie pick.</li>
                    <li><strong>Uniqueness:</strong> All picks must be unique across the league. When making selections, the system checks to ensure your choices haven't already been taken by another member.</li>
                </ul>
                <Link to={`/standings?season=${currentSeason.year}`}><h4>Standings</h4></Link>
                <hr />
                <span>After the first race weekend is registered, the points of each member is calculated, and the one in first place is the one with most points. When there is a tie, their are two tiebreakers in place:  </span>
                <ul>
                    <li>
                        <strong>Rider based tie-breaker</strong>: 
                        <span>In this tie-breaker the system compares each members picks in descending order, where the first member to not have a pick (rider) in the correct position in the top 5 in relation to the current MotoGP Standings, is placed behind. For example lets put this hypothetical situation: </span>
                        <table border="1" className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Motogp Standings</th>
                                    <th>Member One</th>
                                    <th>Member Two</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1. A. Mar</td>
                                    <td>1. A. Mar</td>
                                    <td>1. A. Mar</td>
                                </tr>
                                <tr>
                                    <td>2. M. Mar</td>
                                    <td>2. M. Mar</td>
                                    <td>2. M. Mar</td>
                                </tr>
                                <tr>
                                    <td>3. F. Bag</td>
                                    <td>3. F. Mor</td>
                                    <td>3. F. Bag</td>
                                </tr>
                                <tr>
                                    <td>4. F. Mor</td>
                                    <td>4. F. Bag</td>
                                    <td>4. F. DiGi</td>
                                </tr>
                                <tr>
                                    <td>5. F. DiGi</td>
                                    <td>5. F. Digi</td>
                                    <td>5. F. Mor</td>
                                </tr>
                            </tbody>
                        </table>
                        <span>In this case, Member Two is placed ahead because they maintain the correct order longer (they match the actual 1st, 2nd, and 3rd positions correctly before diverging). In essence, the system puts preference on the person that breaks the order last, or the first one to have a rider in the correct position.</span>
                    </li>
                    <li>
                        <strong>Points based tie-breaker: </strong>
                        <span>If neither member has any riders in the correct positions (i.e., the rider-based tiebreaker can’t resolve the tie), the system compares the total points earned by each pick, one by one. The member whose individual picks start scoring more points earlier is ranked higher.</span>
                    </li>
                </ul>
                <Link to={`race-weekends?season=${currentSeason.year}`}><h4>Race weekends</h4></Link>
                <hr />
                <span>
                    The website tracks and posts the results of each race weekend, including both the main race and sprint race results. After each race weekend, the standings page updates to show the changes in position for each member compared to the previous standings. 
                    Additionally, a comment section is provided for members to share thoughts and interact after the race.
                </span>
                <Link to={`announcements?page=1`}><h4>Announcements</h4></Link>
                <hr />
                <span>On this page, admins can post announcements, and members are able to comment on them. This is useful for sharing updates, such as new features that require member feedback, or any important information that needs to be broadcasted to the league.</span>
            </div>
        </div>
    )
}