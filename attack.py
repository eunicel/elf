import urllib2
import datetime

wl = open('/usr/share/dict/words', 'r')
wordlist = wl.readlines()
wl.close()

def get_redirected_url(url):
    opener = urllib2.build_opener(urllib2.HTTPRedirectHandler)
    request = opener.open(url)
    return request.url

starttime = datetime.datetime.now()
for word in wordlist:
	word = word[0:len(word)] # strips off newline at the end
	original_url = "http://shoutkey.com/" + word
	redirected_url = get_redirected_url(original_url)
	num_redirected = 0
	if redirected_url == original_url:
		# did not redirect
		print word, " did not redirect"
	else:
		# redirected
		print word, " redirected to ", redirected_url
		num_redirected += 1

totaltime = datetime.datetime.now() - starttime
print totaltime
print "TOTAL NUMBER OF WORDS = ", len(wordlist)
print "NUMBER OF REDIRECTS = ", num_redirected

		
