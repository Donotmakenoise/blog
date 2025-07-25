---
title: Remote Desktop Penetration Testing (Port 3389)
excerpt: In this article, we are discussing Remote Desktop penetration testing in four scenarios. Through that, we are trying to explain how an attacker can breach security in a different- different scenario and what types of the major step should take by admin while activating RDP services to resist against attack.
readTime: 10 min read
category: Educational
tags: Remote Desktop, Penetration Testing, Port 3389
status: published
---

<p>In this article, we are discussing Remote Desktop penetration testing in four scenarios. Through that, we are trying to explain how an attacker can breach security in a different- different scenario and what types of the major step should take by admin while activating RDP services to resist against attack.</p>
<h3>Table of Content</h3>
<p><strong>Introduction</strong></p>
<ul>
<li>Enabling RDP</li>
</ul>
<p><strong>Nmap Port Scan</strong></p>
<p><strong>Login Bruteforce Attack</strong></p>
<ul>
<li>Hydra</li>
</ul>
<p><strong>Mitigation Against Bruteforce</strong></p>
<ul>
<li>Account Lockout Policy</li>
</ul>
<p><strong>Post Exploitation using Metasploit</strong></p>
<ul>
<li>getgui</li>
<li>enable_rdp</li>
</ul>
<p><strong>Persistence</strong></p>
<ul>
<li>sticky_keys</li>
</ul>
<p><strong>Credential Dumping</strong></p>
<ul>
<li>Mimikatz</li>
</ul>
<p><strong>Session Hijacking</strong></p>
<p><strong>Mitigation Against Session Hijacking</strong></p>
<ul>
<li>Detection</li>
<li>Session Time Limits</li>
</ul>
<p><strong>DOS Attack</strong></p>
<ul>
<li>MS12-020 Free DoS</li>
</ul>
<p><strong>Exploitation</strong></p>
<ul>
<li>BlueKeep Attack</li>
</ul>
<p><strong>Change RDP Port</strong></p>
<p><strong>Man In The Middle Attack</strong></p>
<ul>
<li>SETH Toolkit</li>
</ul>
<p><strong>Conclusion</strong></p>
<h3>Introduction</h3>
<p>From&nbsp;<strong><a href="https://en.wikipedia.org/wiki/Remote_Desktop_Protocol#:~:text=Remote%20Desktop%20Protocol%20(RDP)%20is,must%20run%20RDP%20server%20software.">Wikipedia</a></strong>&nbsp;Microsoft developed the Remote Desktop Protocol (RDP), also known as &ldquo;Terminal Services Client,&rdquo; which provides users with a graphical interface to connect to another computer over a network connection. Windows operating systems include RDP servers by default; the server listens on TCP port 3389.&nbsp;</p>
<p>In a network environment, administrators should disable the services that they are not using as these can be a potential cause for a compromise. The Remote Desktop Service is no exception to this. If the system disables the service, users can enable it using the following steps. Inside the Control Panel of the System, a System and Security Section exists. Inside this section, there is a System Section. After traversing inside this section, in the left-hand side menu, there exists a Remote Settings option as depicted in the image below. It can also be verified that the System that we working on is Windows 10 Enterprise Edition.</p>
<p><img src="https://1.bp.blogspot.com/-Wvo7f75vWPA/YMScX2U5O4I/AAAAAAAAwWw/0O1OfhxzzjAh7dSJKHcp0OCSPHv1ByTaQCLcBGAsYHQ/s16000/1.png"></p>
<p>Clicking on the Remote Setting option, we see that a small window opens. It consists of multiple tabs. However, inside the Remote Tab, we see that there is a section labeled as Remote Desktop. This section can be used to Enable or Disable the Remote Desktop Service. For the time being, we are enabling the Service as shown in the image below.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-U4nbwdrsaGI/YMSccrDIxbI/AAAAAAAAwW0/6EdOUg0w5t8WTlhdHwDImDFosvKK7oWoACLcBGAsYHQ/s16000/2.png" alt="RDP penetration testing port 3389" width="412" height="465"></p>
<h3>Nmap Port Scan</h3>
<p>Since we have enabled the Remote Desktop service on our Windows Machine, it is possible to verify the service running on the device by performing a Nmap Port Scan. By default, the port that the Remote Desktop service runs on is port 3389. It can be observed that the Windows machine with IP Address 192.168.1.41 has Remote Desktop Service successfully. It is also able to extract the System Name of the Machine, it is MSEDGEWIN10.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">nmap -A -p3389 </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">41</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-SJ4EeG6SEQM/YMSch-w3srI/AAAAAAAAwW4/WUxjHfysN98g8WFftVGZjgPqlJH6NfEIACLcBGAsYHQ/s16000/3.png"></p>
<h3>Login Bruteforce</h3>
<p>In a process of performing a penetration test on the Remote Desktop service, after the Nmap scan, it is time to do a Bruteforce Attack. There is a long list of tools that can be used to perform a Bruteforce attack but one of the most reliable tools that can make the job done is Hydra. Although called a Bruteforce, it is more like a dictionary attack. We need to make two dictionaries one with a list of probable usernames and another with a list of probable passwords. The dictionaries are named user.txt and pass.txt.</p>
<p>With all this preparation, all that is left is to provide the dictionaries and the IP Address of the target machine to the Hydra to perform a Bruteforce attack on the Login of RDP. We see that a set of credentials was recovered. It is possible to initiate an RDP session using this set of credentials.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">hydra -L user.</span><span class="enlighter-m3">txt</span><span class="enlighter-text"> -P pass.</span><span class="enlighter-m3">txt</span> <span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">41</span><span class="enlighter-text"> rdp</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-TWfqqDSUvtg/YMScqVOoDzI/AAAAAAAAwXA/EiZd6WbLzOk5gvVbsUyfYbvATbEMA0thwCLcBGAsYHQ/s16000/4.png"></p>
<h3>Mitigation Against Bruteforce</h3>
<p>The Bruteforce attack that we just performed can be mitigated. It requires the creation of an Account Policy that will prevent Hydra or any other tool from trying multiple credentials. It is essentially a Lockout Policy. To toggle this policy, we need to open the Local Security Policy window. This can be done by typing &ldquo;secpol.msc&rdquo;. It will open a window similar to the one shown below.</p>
<p>To get to the particular policy we need to Account Policies under Security Settings. Inside the Account Policies, there exists an Account Lockout Policy. It contains 3 policies each working on an aspect of the Account Lockout. The first one controls the duration of the lockout. This is the time that is required to be passed to log in again after the lockout. Then we have the Lockout Threshold. This controls the number of invalid attempts. Please toggle these as per your requirements. This should prevent the Bruteforce attack.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-cVhWz8pYDBA/YMSc000oAPI/AAAAAAAAwXM/64hEPw7tIPcPMIb94DtBrgNTQoH7G61mACLcBGAsYHQ/s16000/5.png" alt="RDP penetration testing port 3389" width="755" height="365"></p>
<p>After trying the Bruteforce attack using Hydra, it can be observed that it is not possible to extract the credentials as before. Although there is still some risk that can be prevented by forcing the users to change the passwords frequently and enforcing good password policies.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">hydra -L user.</span><span class="enlighter-m3">txt</span><span class="enlighter-text"> -P pass.</span><span class="enlighter-m3">txt</span> <span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">41</span><span class="enlighter-text"> rdp</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-0lY1vf_6mOs/YMSc5LlDE9I/AAAAAAAAwXQ/5ySh8pfmzO4NJuXDYDfBncSWbc_EwT9QwCLcBGAsYHQ/s16000/6.png"></p>
<p>As we enabled a lockout policy, we will not be able to log in on the machine even with the correct password until the time passed that we toggled in the policy. You will be greeted with a Lockout message as shown in the image below.</p>
<p><img src="https://1.bp.blogspot.com/-wZbOYaA1Zow/YMSc-iHP-dI/AAAAAAAAwXY/q0IFkJBwtzw5wYoRlElzTea6MVF8M41AwCLcBGAsYHQ/s16000/7.png"></p>
<h3>Post Exploitation using Metasploit</h3>
<p>Although it has been years since its introduction, the Metasploit Framework is still one of the most reliable ways to perform post-exploitation. During Penetration Testing, if there exists a machine that has RDP disabled, it is possible to enable RDP on that device through a meterpreter. In the image below, we have the meterpreter of the machine that has RDP disabled. We use the getgui command on meterpreter to create a user by the name of ignite with a password as 123. After completion, we can log in on the machine as ignite user through RDP.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">run getgui -e -u ignite -p </span><span class="enlighter-n1">123</span></div>
</div>
</div>
</div>
</div>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-QyFsSE8gZbA/YMSdIklKU1I/AAAAAAAAwXg/VOFVRMwXivwwyEkXLGXmCqXJjMXmp9M_ACLcBGAsYHQ/s16000/8.png" alt="RDP penetration testing port 3389" width="696" height="294"></p>
<p>This was the meterpreter command getgui. It uses the post/windows/manage/enable_rdp module to add a new user with RDP privileges. Let&rsquo;s try to use the module directly. We background the meterpreter sessions and then open the enable_rdp module. We provide the username and password for the user to be created and the session identifier. It will create another user by the name of Pavan with a password as 123 on the machine which then can be used for accessing the machine through RDP.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use post/windows/mange/enable_rdp</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set username pavan</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set password </span><span class="enlighter-n1">123</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set session </span><span class="enlighter-n1">1</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-XyN-6n9mRLw/YMSdNaYphpI/AAAAAAAAwXo/SEIqap-W-UUXeO2sgfqUr2V2P5bn8PDEQCLcBGAsYHQ/s16000/9.png"></p>
<h3>Persistence</h3>
<p>The session that can be accessed as the user that is created using the enable_rdp module will be a low privilege session. This can be further elevated to gain Administrative Privileges with the combination of using the sticky_keys exploit. After selecting the exploit, we need to provide a session identifier. In the image, it can be observed that the exploit was created successfully. It replaces the Ease of Access Sticky Keys operation to Command Prompt so that when Sticky Keys is initiated on the machine, it opens a Command Prompt with elevated access.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use post/windows/manage/sticky_keys</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set session </span><span class="enlighter-n1">1</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-VHgjhqAYyNc/YMSdaTV6TxI/AAAAAAAAwXw/V1XCZXP9OgAOMEjKX-Swa2_XEXADPiVxwCLcBGAsYHQ/s16000/10.png"></p>
<p>Since Sticky Keys can be initiated by pressing the Shift key 5 times, we connect to the target machine using RDP and then proceed to do so. This will open an elevated command prompt window as shown in the image below.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-EpOK4g8L7FA/YMSdfeQurpI/AAAAAAAAwX4/pgi_ZpolWDQCcQ4vrqw5mKLBz9dr_V-SwCLcBGAsYHQ/s16000/11.png" alt="RDP penetration testing port 3389" width="982" height="778" loading="lazy"></p>
<h3>Credential Dumping</h3>
<p>Mimikatz can be used to perform this kind of attack. As the attacker was able to gain the session of the machine. They used Mimikatz and ran the mstsc function inside the ts module. Mstsc is a process that runs when the Remote Desktop service in use. It then intercepts the RDP protocol communication to extract the stored credentials. It can be seen in the image below that Mimikatz can extract the credentials for the user raj.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">privielge::debug</span></div>
</div>
<div class="">
<div><span class="enlighter-text">ts::mstsc</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-8DXenuXQ0EY/YMSdtxXlulI/AAAAAAAAwYA/uWGuRG5F_4E9JH_ml4uFekfqQ6-uayWXQCLcBGAsYHQ/s16000/12.png"></p>
<h3>Session Hijacking</h3>
<p>Session Hijacking is a type of attack where an attacker can gain access to an active session that is not directly accessible to the attacker. To demonstrate this kind of attacker we need to create a scenario. Here we have a Windows Machine with Remote Desktop service enabled and running with two active users: raj and aarti. One of the most important factors to perform a Session Hijacking Attack is that another session that we are trying to hijack must be an active session. Here, the raj user and aarti user both are active users with active sessions on the target machine.</p>
<p><img src="https://1.bp.blogspot.com/-wNdhOgrWUNE/YMSd00H2CVI/AAAAAAAAwYI/efbUDoCxYo4RllGQGs6nsxFOUwfRVMMcgCLcBGAsYHQ/s16000/13.png"></p>
<p>We log in to the raj user using the credentials that we were able to extract using the Mimikatz.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-BbuZHQuuO64/YMSeLx_UhBI/AAAAAAAAwYU/hJj7cRrRrDIG-WiX96DITP24TqBK1Yi1gCLcBGAsYHQ/s16000/14.png" alt="RDP penetration testing port 3389" width="490" height="194" loading="lazy"></p>
<h4>Enumerate Sessions</h4>
<p>Now we will need to run the Mimikatz again after logging in as raj user. We need to list all the active sessions. We use the sessions command from the ts module. Here we can see that there exists a Session 3 for aarti user that is active.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">privilege::debug</span></div>
</div>
<div class="">
<div><span class="enlighter-text">ts::sessions</span></div>
</div>
</div>
</div>
</div>
<p><strong><img src="https://1.bp.blogspot.com/-Fph7YyNJeJI/YMSeQZvc88I/AAAAAAAAwYY/d1Z8xoMTOB4g1GOJKMguH9anKD-nwvFSgCLcBGAsYHQ/s16000/15.png"></strong></p>
<p>We use the elevate command from the token module to impersonate token for the NT AuthoritySYSTEM and provide the ability for connecting to other sessions. Back to the session output, we saw that the aarti user has session 3. We need to connect to that particular session using the remote command of the ts module.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">token::elevate</span></div>
</div>
<div class="">
<div><span class="enlighter-text">ts::remote /id:</span><span class="enlighter-n1">3</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-b5kZ7CWqT90/YMSeeRGQMVI/AAAAAAAAwYc/2Q3-l8huCegl27c5w8vo6e-68lvdm_jqACLcBGAsYHQ/s16000/16.png"></p>
<p>As we can see in the image that we were able to get the remote desktop session for the aarti user from the raj user access. This is the process that a Session Hijacking is possible for the Remote Desktop services.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-SMOTAHggIqE/YMSejjB-2eI/AAAAAAAAwYk/KRoRHLU1yssMjtl0_4r5mh5yZFEfzrdIACLcBGAsYHQ/s16000/17.png" alt="RDP penetration testing port 3389" width="900" height="643" loading="lazy"></p>
<h3>Mitigation against Session Hijacking</h3>
<p>To discuss mitigation, we first need to detect the possibility of the attack. As all the services on Windows, Remote Desktop also creates various logs that contains information about the users that are logged on, or the time when they logged on and off with the device name and in some case IP Address of the user connecting as well.</p>
<p>There exist various types of logs regarding the Remote desktop service. It includes the Authentication Logs, Logon, Logoff, Sessions Connection. While connecting to the client the authentication can either be successful or failure. With both these cases, we have different EventIDs to recognise. The authentication logs are located inside the Security Section.</p>
<p><strong>EventID 4624: Authentication process was successful</strong></p>
<p><strong>EventID 4625: Authentication process was failure</strong></p>
<p>&nbsp;Then we have the Logon and Logoff events. Logon will occur after successful authentication. Logoff will track when the user was disconnected from the system. These particular logs will be located at the following:</p>
<h5>Applications and Services Logs &gt; Microsoft &gt; Windows &gt; TerminalServices-LocalSessionManager &gt; Operational.</h5>
<p><strong>Event ID 21: Remote Desktop Logon</strong></p>
<p><strong>Event ID 23: Remote Desktop Logoff</strong></p>
<p>At last, we have the Session Connection Logs. This category has the most Events because there are various reasons for disconnection and it should be clear to the user based on the particular EventID. These logs are located at the following:</p>
<h5>Applications and Services Logs &gt; Microsoft &gt; Windows &gt; TerminalServices-LocalSessionManager &gt; Operational.</h5>
<p><strong>EventID 24: Remote Desktop Session is disconnected</strong></p>
<p><strong>EventID 25: Remote Desktop Session is reconnection</strong></p>
<p>We can see that in the given image the aarti user was reconnected. This is a log entry from the time we performed the Session Hijacking demonstration. That means if an attacker attempts that kind of activity, you might be looking for this kind of logs.</p>
<p><img src="https://1.bp.blogspot.com/-gc9IqfDkqDY/YMSep4P_NNI/AAAAAAAAwYo/BkZSrvSLOt07d9sj3JDTigRjOLAmeWGaQCLcBGAsYHQ/s16000/18.png"></p>
<p>For Mitigation, we can set a particular time limit for disconnected sessions, idle Remote Desktop services that might be clogging up the memory usage and others. These policies can be found at:</p>
<h5>Administrative Templates &gt; Windows Components &gt; Remote Desktop Services &gt; Remote Desktop Session Host &gt; Session Time Limits.</h5>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-2fEtBKu5vDs/YMSeuP2uK1I/AAAAAAAAwYw/2nup7oEPHdIu0kNJnqtPPn8abMzFvGTVgCLcBGAsYHQ/s16000/19.png" alt="RDP penetration testing port 3389" width="742" height="502" loading="lazy"></p>
<p>When implemented, these policies will restrict the one necessity required by the session hijacking i.e., Active User Session. Hence, mitigation the possibility of Session Hijacking altogether.</p>
<h3>DoS Attack (MS12-020 Free DoS)</h3>
<p>DoS Attack or Denial-of-Service in respect of the Remote Desktop services is very similar to the typical DoS attack. One of the things to notice before getting on with the attack is that DoS Attacks through Remote Desktops are generally not possible. In this demonstration, we will be using a Windows 7 machine. Before getting to the exploit, Metasploit has an auxiliary that can be used to scan the machine for this particular vulnerability. As it can be observed from the image below that the machine that we were targeting is vulnerable to a DoS attack.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use auxiliary/scanner/rdp/ms12_020_check</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set rhosts </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">21</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-GHozhLXLBT0/YMSe4Lfk5BI/AAAAAAAAwY4/lxowH56RuREATGJ_-2N4LZ_8wk4BgxLugCLcBGAsYHQ/s16000/20.png"></p>
<p>Now that we have the confirmation for the vulnerability, we can use it to attack our target machine. This attack is named as max channel attack. This attack works in the following method. Firstly, it detects the target machine using the IP Address. Then it tries to connect to the machine through the RDP service. When the target machine responds that it is ready to connect, the exploit sends large size packets to the machine. The size of the packets is incremental until it becomes unresponsive. In our demonstration, we can see that it starts with a 210 bytes packet.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use auxiliary/dos/windows/rdp/ms12_020_maxchannelids</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set rhosts </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">21</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
</div>
</div>
</div>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-gQ51W6oIhuc/YMSfAnL77cI/AAAAAAAAwZE/UrYWsOr01vAP1zoUnBYkQxmnvoRUjFhsQCLcBGAsYHQ/s16000/21.png" alt="RDP penetration testing port 3389" width="673" height="152" loading="lazy"></p>
<p>It will continue to send packets until the target machine is unable to handle those packets. It can be observed from the image below that that target machine crashed resulting in a BSOD or Blue Screen of Death.</p>
<p><img src="https://1.bp.blogspot.com/-qWx48Cuvz74/YMSfGHjaL6I/AAAAAAAAwZI/yqywjWQcOHQZegHZSWGEzFpG0GW0LYciACLcBGAsYHQ/s16000/22.png"></p>
<h3>Exploitation: BlueKeep</h3>
<p>Researchers discovered BlueKeep, a security vulnerability in Remote Desktop Protocol implementation that can allow an attacker to perform remote code execution. They reported it in mid-2019. Attackers primarily targeted Windows Server 2008 and Windows 7. To understand the attack, we need to recognize that RDP uses virtual channels, which administrators configure before authentication. If a server binds the virtual channel &ldquo;MS_T120&rdquo; with a static channel other than 31, heap corruption occurs, allowing for arbitrary code execution at the system level. But since this attack is based on heap corruption, there is a chance that if the configuration of the exploit is incorrect it could lead to memory crashes.</p>
<p>Metasploit contains an auxiliary scanner and exploit for BlueKeep. Let&rsquo;s focus on the scanner. It requires the IP Address of the target machine. We are running this against a Windows 7 machine with Remote Desktop enabled. We see that it returns that the target is vulnerable.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use auxiliary/scanner/rdp/cve_2019_0708_bluekeep</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set rhosts </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">16</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
</div>
</div>
</div>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-nkX48DfORo4/YMSfLkzha5I/AAAAAAAAwZQ/1nIPkMEqxP0kGncad-fhuzWqaxehya-OwCLcBGAsYHQ/s16000/23.png" alt="RDP penetration testing port 3389" width="657" height="155" loading="lazy"></p>
<p>Since we now know that the target is vulnerable, we can move on to exploiting the target.&nbsp; After selecting the exploit, we provide the remote IP address of the machine with the particular target. It can vary based on the Operating System; for Windows 7 use the target as 5. We can see that it connects to the target and first checks if it is vulnerable. Then it proceeds to inflict the heap corruption that we discussed earlier and results in a meterpreter shell on the target machine.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">use exploit/windows/rdp/cve_2019_0708_bluekeep_rce</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set rhosts </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">16</span></div>
</div>
<div class="">
<div><span class="enlighter-text">set target </span><span class="enlighter-n1">5</span></div>
</div>
<div class="">
<div><span class="enlighter-text">exploit</span></div>
</div>
<div class="">
<div><span class="enlighter-text">sysinfo</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-e0jMUJlLEJQ/YMSfRdI9g7I/AAAAAAAAwZY/4s784Chnc40gNPU8ZqQWrPkyvhfgLtlWgCLcBGAsYHQ/s16000/24.png"></p>
<h3>Changing the RDP Port</h3>
<p>There are a lot of mitigations that can help a wide range of environments. It can include installing the latest updates and security patches from Microsoft or as the NSA suggests to disable the Remote Desktop Service until use and disable after use. Upgrading the Operating System from Windows 7 can mitigate BlueKeep attacks to the greatest extent. You can implement a long list of other mitigation steps, such as implementing an Intrusion Detection Mechanism and other defense mechanisms.</p>
<p>One of the steps we can take with immediate effect is to change the port number on which the Remote Desktop operates. Although this seems to be not a big defense mechanism, if done correctly, the attacker might not even look for this angle. Anyone who thinks RDP thinks 3389 but when changed it is possible that the attacker won&rsquo;t even be able to detect the presence of RDP. To do this, we need to make changes to the registry. Open the registry editor and proceed to the following path:</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">ComputerHKEY_LOCAL_MACHINESYSTEMCurrentControlSetControlTerminal ServerWinStationsRDP-Tcp</span></div>
</div>
</div>
</div>
</div>
<p>Here we have the Port Number as shown in the image. Change it to another value and save your changes and now the RDP will be running on the specified port.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-GQUmlv7krg4/YMSfYlUU_PI/AAAAAAAAwZg/eXQ4AniMOKobqIwP7b1XK_cXPVhvMuyVgCLcBGAsYHQ/s16000/25.png" alt="RDP penetration testing port 3389" width="698" height="466" loading="lazy"></p>
<p>In our demonstration, we changed the port to 3314 from 3389. We can use the rdesktop command from Linux to connect to the Windows Machine as shown in the image given below.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">rdesktop </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">41</span><span class="enlighter-text">:</span><span class="enlighter-n1">3314</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-H2H4ZaAdHpg/YMSfeSPcI7I/AAAAAAAAwZk/aE32kS5uBWI1u0Rf-eoya6d0OUm7UbCUwCLcBGAsYHQ/s16000/26.png"></p>
<h3>Man-in-the-Middle Attack: SETH</h3>
<p>As we are familiar with the typical Man-in-the-Middle Attacks that the attacker most likely impersonates the correct authentication mode and the user who is unaware of the switch unknowingly provides the correct credentials. Some other methods and tools can be used to perform this kind of attack but the SETH toolkit is the one that seems elegant. We start with cloning it directly from its GitHub Repository and then installing some pre-requirements.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">git clone https:</span><span class="enlighter-c0">//github.com/SySS-Research/Seth.git</span></div>
</div>
<div class="">
<div><span class="enlighter-text">cd Seth</span></div>
</div>
<div class="">
<div><span class="enlighter-text">pip install -r requirements.</span><span class="enlighter-m3">txt</span></div>
</div>
<div class="">
<div><span class="enlighter-text">apt install dsniff</span></div>
</div>
</div>
</div>
</div>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-1-QlR3YT_bs/YMSflHUsUeI/AAAAAAAAwZs/6dmuQLWtRhkixNqIst8sy9fhp-46tPUdACLcBGAsYHQ/s16000/27.png" alt="RDP penetration testing port 3389" width="509" height="372" loading="lazy"></p>
<h4>Launching the Attack</h4>
<p>After the installation, we require the local IP Address, Target IP Address, and the Network Interface that will be used to mount the attack. In this case, it is eth0. Here we see that we have mounted the attack and it is ready for the victim.</p>
<div class="enlighter-default enlighter-v-standard enlighter-t-enlighter enlighter-l-generic enlighter-hover enlighter-linenumbers ">
<div class="enlighter-code">
<div class="enlighter">
<div class="">
<div><span class="enlighter-text">/seth.</span><span class="enlighter-m3">sh</span><span class="enlighter-text"> eth0 </span><span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">5</span> <span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">3</span> <span class="enlighter-n0">192.168</span><span class="enlighter-text">.</span><span class="enlighter-m3">1</span><span class="enlighter-text">.</span><span class="enlighter-m3">41</span></div>
</div>
</div>
</div>
</div>
<p><img src="https://1.bp.blogspot.com/-hUDs3Yyx474/YMSfpQ8hP1I/AAAAAAAAwZ0/XW7ZkR7YdCQVjHnqTPOvde68Nwav49y9gCLcBGAsYHQ/s16000/28.png"></p>
<p>We see that from the victim&rsquo;s perspective, they open up the Remote Desktop Connection dialogue and try to connect to the machine and user of their choice. It asks for the credentials to connect as any original security authentication prompt.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-rE7yZLabsQc/YMSfu--e2WI/AAAAAAAAwZ4/8dDt7Yd_ZgMNr_gUflLMSQGeL_hjjue7gCLcBGAsYHQ/s16000/29.png" alt="RDP penetration testing port 3389" width="407" height="551" loading="lazy"></p>
<p>Next, we have is the Certificate Manager. Here we can see that there seems to be a conflict regarding the Server Name and Trusted Certifying authority. This is usually quite similar to the window that asks for saving the certificate. The victim won&rsquo;t think twice before clicking Yes on the window.</p>
<p><img src="https://1.bp.blogspot.com/-ODWw0NYFOJk/YMSf2mWeCUI/AAAAAAAAwZ8/gomXlmIWbF4mJro_d8zLmCE4FKXJaHYVQCLcBGAsYHQ/s16000/30.png"></p>
<p>As soon as we establish the connection, we can go back to the Kali Linux where we mounted the attack. We can see that it captured the NTLM hash as well as the password that the victim entered. This completes the Man-In-the-Middle Attack.</p>
<p><img class="alignnone" src="https://1.bp.blogspot.com/-5WGgzMtbfbQ/YMSf6wo-jFI/AAAAAAAAwaE/WeuFOtYCuxgD5z4x89Ak4Mfx8r4tHxenACLcBGAsYHQ/s16000/74.png" alt="RDP penetration testing port 3389" width="607" height="375" loading="lazy"></p>
<h3>Conclusion</h3>
<p>Remote Desktop Service is one of the most used services. Microsoft brought it at a quite important time, but the Pandemic and Work from Home culture have made it a necessity for every enterprise. This article serves as a detailed guide to how to perform a penetration test on an RDP Setup. We hope it can give penetration testers the edge that they need over threat actors targeting their RDP Environment.</p>